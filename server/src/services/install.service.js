const conn = require("../config/db.config");
const fs = require("fs");
const path = require("path");

console.log("Install service loaded from:", __filename);

async function install() {
  const queryfile = path.join(__dirname, "..", "sql", "initial-queries.sql");
  console.log("Install service reading file:", queryfile);
  let queries = [];
  let finalMessage = {};
  let templine = "";

  await conn.ensureDatabase();

  const lines = fs.readFileSync(queryfile, "utf-8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("--") || trimmed === "") {
      return;
    }
    templine += `${line}\n`;
    if (trimmed.endsWith(";")) {
      queries.push(templine.trim());
      templine = "";
    }
  });

  for (let i = 0; i < queries.length; i++) {
    try {
      await conn.query(queries[i]);
    } catch (err) {
      console.error("Error executing query:", err.message);
      // Check if it's a duplicate column error (MySQL error code 1060)
      if (
        err.code === "ER_DUP_FIELDNAME" ||
        err.message.includes("Duplicate column name")
      ) {
        console.log("Column already exists, continuing...");
        continue;
      }
      // For other errors, set the error message
      finalMessage.message = "Not all tables are created";
      finalMessage.error = err.message;
    }
  }

  // Populate data from catalog.json
  try {
    await populateFromCatalog();
    if (!finalMessage.message) {
      finalMessage.message =
        "All tables created and data populated successfully";
      finalMessage.status = 200;
    }
  } catch (err) {
    console.error("Error populating data:", err.message);
    finalMessage.message = "Tables created but data population failed";
    finalMessage.status = 500;
  }

  return finalMessage;
}

async function populateFromCatalog() {
  const catalogPath = path.join(__dirname, "..", "..", "data", "catalog.json");
  console.log("Looking for catalog at:", catalogPath);
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

  // Insert categories
  for (const category of catalogData.categories) {
    await conn.query(
      "INSERT INTO categories (id, name, slug, image_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), image_url = VALUES(image_url)",
      [category.id, category.name, category.slug, category.image_url],
    );
  }

  // Insert products
  for (const product of catalogData.products) {
    await conn.query(
      `INSERT INTO products (
        id, name, description, price, image_url, category_slug, stock_quantity,
        is_best_seller, is_featured, average_rating, total_ratings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        description = VALUES(description),
        price = VALUES(price),
        image_url = VALUES(image_url),
        category_slug = VALUES(category_slug),
        stock_quantity = VALUES(stock_quantity),
        is_best_seller = VALUES(is_best_seller),
        is_featured = VALUES(is_featured),
        average_rating = VALUES(average_rating),
        total_ratings = VALUES(total_ratings)`,
      [
        product.id,
        product.name,
        product.description || null,
        product.price,
        product.image_url,
        product.category_slug,
        product.stock_quantity || 0,
        product.is_best_seller || 0,
        product.is_featured || 0,
        product.average_rating || 0,
        product.total_ratings || 0,
      ],
    );
  }

  console.log(
    `Populated ${catalogData.categories.length} categories and ${catalogData.products.length} products`,
  );
}

module.exports = { install };
