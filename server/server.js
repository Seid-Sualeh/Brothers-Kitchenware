const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { notifyAdmins } = require("./src/services/admin.service");
const { authCustomer } = require("./src/utils/auth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});
app.use(cors());
app.use(express.json());
app.locals.io = io;

const catalogPath = path.join(__dirname, "data", "catalog.json");
let memoryCatalog = null;
let pool = null;
let dbReady = false;

function loadMemoryCatalog() {
  const raw = fs.readFileSync(catalogPath, "utf8");
  memoryCatalog = JSON.parse(raw);
}

function ensureMemoryCatalog() {
  if (!memoryCatalog) {
    loadMemoryCatalog();
  }
}

async function initDatabase() {
  if (process.env.USE_MEMORY === "true") {
    loadMemoryCatalog();
    console.log("Using in-memory catalog (USE_MEMORY=true)");
    return;
  }
  try {
    const mysql = require("mysql2/promise");
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "brothers_kitchenware",
    });
    await pool.query("SELECT 1");
    dbReady = true;
    console.log("MySQL pool connected");
  } catch (err) {
    console.warn("MySQL unavailable, using in-memory catalog:", err.message);
    loadMemoryCatalog();
    pool = null;
    dbReady = false;
  }
}

function memoryProducts(filters = {}) {
  let list = [...memoryCatalog.products];
  if (filters.category) {
    const slug = String(filters.category).toLowerCase();
    list = list.filter((p) => p.category_slug === slug);
  }
  if (filters.featured) {
    list = list.filter((p) => p.is_featured === 1);
  }
  if (filters.bestSeller) {
    list = list.filter((p) => p.is_best_seller === 1);
  }
  if (filters.search) {
    const q = String(filters.search).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    );
  }
  return list;
}

async function getCategories() {
  if (!dbReady || !pool) {
    ensureMemoryCatalog();
    return memoryCatalog.categories;
  }
  try {
    const [rows] = await pool.query(
      "SELECT id, name, slug, image_url FROM categories ORDER BY id ASC",
    );
    if (!rows.length) {
      ensureMemoryCatalog();
      return memoryCatalog.categories;
    }
    return rows;
  } catch (err) {
    console.warn("categories query failed, using catalog.json:", err.message);
    ensureMemoryCatalog();
    return memoryCatalog.categories;
  }
}

async function getProducts(query) {
  const { category, search } = query;
  if (!dbReady || !pool) {
    ensureMemoryCatalog();
    return memoryProducts({ category, search });
  }
  let sql = "SELECT * FROM products WHERE stock_quantity > 0";
  const params = [];
  if (category) {
    sql += " AND category_slug = ?";
    params.push(String(category).toLowerCase());
  }
  if (search) {
    sql += " AND (name LIKE ? OR description LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like);
  }
  sql += " ORDER BY id DESC";
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.warn("products query failed, using catalog.json:", err.message);
    ensureMemoryCatalog();
    return memoryProducts({ category, search });
  }
}

async function getProductById(id) {
  const numId = Number(id);
  if (!dbReady || !pool) {
    ensureMemoryCatalog();
    return memoryCatalog.products.find((p) => p.id === numId) || null;
  }
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      numId,
    ]);
    return rows[0] || null;
  } catch (err) {
    console.warn("product by id failed, using catalog.json:", err.message);
    ensureMemoryCatalog();
    return memoryCatalog.products.find((p) => p.id === numId) || null;
  }
}

async function getLandingPayload() {
  const categories = await getCategories();
  let featured;
  let bestSellers;
  if (!dbReady || !pool) {
    featured = memoryProducts({ featured: true }).slice(0, 3);
    bestSellers = memoryProducts({ bestSeller: true }).slice(0, 8);
  } else {
    try {
      const [f] = await pool.query(
        "SELECT * FROM products WHERE is_featured = 1 AND stock_quantity > 0 ORDER BY id DESC LIMIT 3",
      );
      const [b] = await pool.query(
        "SELECT * FROM products WHERE is_best_seller = 1 AND stock_quantity > 0 ORDER BY id DESC LIMIT 8",
      );
      featured = f;
      bestSellers = b;
    } catch (err) {
      console.warn(
        "landing MySQL query failed, using catalog.json:",
        err.message,
      );
      ensureMemoryCatalog();
      featured = memoryProducts({ featured: true }).slice(0, 3);
      bestSellers = memoryProducts({ bestSeller: true }).slice(0, 8);
    }
  }
  return { categories, featured, bestSellers };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: dbReady && pool ? "mysql" : "memory" });
});

app.get("/api/categories", async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await getProducts(req.query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/landing", async (_req, res) => {
  try {
    const { categories, bestSellers } = await getLandingPayload();
    res.json({ categories, bestSellers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product ratings routes
app.get("/api/products/:id/ratings", async (req, res) => {
  try {
    const productId = req.params.id;
    const [ratings] = await pool.query(
      "SELECT id, user_name, rating, review, created_at FROM product_ratings WHERE product_id = ? ORDER BY created_at DESC",
      [productId],
    );
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products/:id/ratings", authCustomer, async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, review } = req.body;
    const userId = req.user.sub;
    const userName = req.user.name;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user already rated this product
    const [existing] = await pool.query(
      "SELECT id FROM product_ratings WHERE product_id = ? AND user_id = ?",
      [productId, userId],
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already rated this product" });
    }

    await pool.query(
      "INSERT INTO product_ratings (product_id, user_id, user_name, rating, review) VALUES (?, ?, ?, ?, ?)",
      [productId, userId, userName, rating, review || null],
    );

    // Update product average rating
    await pool.query(
      `
      UPDATE products
      SET average_rating = (
        SELECT AVG(rating) FROM product_ratings WHERE product_id = ?
      ),
      total_ratings = (
        SELECT COUNT(*) FROM product_ratings WHERE product_id = ?
      )
      WHERE id = ?
    `,
      [productId, productId, productId],
    );

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/landing", async (_req, res) => {
  try {
    const payload = await getLandingPayload();
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!dbReady || !pool) {
    return res.status(201).json({ success: true, mode: "memory" });
  }
  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
    );
    await notifyAdmins(pool, {
      type: "contact_message",
      title: "New Contact Message",
      body: `Message from ${name} (${email}): ${message}`,
    });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const registerAdminRoutes = require("./adminRoutes");
const installRoutes = require("./src/routes/install.routes");

io.on("connection", () => {});

const PORT = process.env.PORT || 5000;

app.use("/api", installRoutes);

initDatabase().then(() => {
  registerAdminRoutes(app, () => ({ pool, dbReady }));

  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
