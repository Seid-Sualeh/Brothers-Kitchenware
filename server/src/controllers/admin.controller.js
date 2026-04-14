const {
  createCustomer,
  loginCustomer,
  getUserById,
  loginAdmin,
  createEmployee,
  createProduct,
  deleteProduct,
  updateProduct,
  notifyAdmins,
  checkoutOrder,
  getCustomerOrders,
  getNotifications,
  markNotificationRead,
  getAnalyticsSummary,
  getRecentSales,
  getTopProducts,
  getLowStock,
  confirmOrder,
  cancelOrder,
  getAdminNotifications,
  markAdminNotificationRead,
} = require("../services/admin.service");
const { signToken } = require("../utils/auth");

function createSessionToken(user) {
  return signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

async function registerCustomerController(req, res) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "email, password, and name are required" });
    }
    const user = await createCustomer(req.db, { email, password, name });
    const token = createSessionToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: err.message });
  }
}

async function loginCustomerController(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = await loginCustomer(req.db, { email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = createSessionToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMeController(req, res) {
  try {
    const user = await getUserById(req.db, req.user.sub);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function loginAdminController(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    const user = await loginAdmin(req.db, { email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }
    const token = createSessionToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function checkoutController(req, res) {
  try {
    const { items } = req.body || {};
    const result = await checkoutOrder(req.db, req.user.sub, items);
    await notifyAdmins(req.db, {
      type: "order_processing",
      title: "New checkout — confirm payment",
      body: `Order #${result.orderId} from ${req.user.name} (${req.user.email}) is awaiting confirmation.`,
      relatedOrderId: result.orderId,
    });
    res.status(201).json(result);
  } catch (err) {
    if (err.message === "items array required") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "User not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function getMyOrdersController(req, res) {
  try {
    const orders = await getCustomerOrders(req.db, req.user.sub);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNotificationsController(req, res) {
  try {
    const rows = await getNotifications(req.db, req.user.sub);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markNotificationReadController(req, res) {
  try {
    await markNotificationRead(req.db, req.user.sub, req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAnalyticsSummaryController(req, res) {
  try {
    const summary = await getAnalyticsSummary(req.db);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRecentSalesController(req, res) {
  try {
    const { period } = req.query;
    const rows = await getRecentSales(req.db, period);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTopProductsController(req, res) {
  try {
    const rows = await getTopProducts(req.db);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLowStockController(req, res) {
  try {
    const rows = await getLowStock(req.db);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function confirmOrderController(req, res) {
  try {
    const orderId = Number(req.params.id);
    const result = await confirmOrder(req.db, orderId);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (result.alreadyCompleted) {
      return res.json({ ok: true, message: "Already completed" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function cancelOrderController(req, res) {
  try {
    const orderId = Number(req.params.id);
    const result = await cancelOrder(req.db, orderId);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (result.alreadyCancelled) {
      return res.json({ ok: true, message: "Already cancelled" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAdminNotificationsController(req, res) {
  try {
    const rows = await getAdminNotifications(req.db, req.staff.sub);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAdminNotificationReadController(req, res) {
  try {
    await markAdminNotificationRead(req.db, req.staff.sub, req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addEmployeeController(req, res) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "email, password, and name are required" });
    }
    const employee = await createEmployee(req.db, { email, password, name });
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

async function addProductController(req, res) {
  try {
    const {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      rating,
      review_count,
      is_best_seller,
      is_featured,
    } = req.body || {};
    if (!name || !price || !image_url || !category_slug) {
      return res.status(400).json({
        error: "name, price, image_url, and category_slug required",
      });
    }
    const product = await createProduct(req.db, {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      rating,
      review_count,
      is_best_seller,
      is_featured,
    });
    await notifyAdmins(req.db, {
      type: "new_product",
      title: "New Product Added",
      body: `Product "${name}" has been added to the catalog.`,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProductController(req, res) {
  try {
    const productId = Number(req.params.id);
    if (!productId) {
      return res.status(400).json({ error: "Product ID required" });
    }
    const deleted = await deleteProduct(req.db, productId);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProductController(req, res) {
  try {
    const productId = Number(req.params.id);
    if (!productId) {
      return res.status(400).json({ error: "Product ID required" });
    }
    const {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      rating,
      review_count,
      is_best_seller,
      is_featured,
    } = req.body || {};
    if (!name || !price || !image_url || !category_slug) {
      return res.status(400).json({
        error: "name, price, image_url, and category_slug required",
      });
    }
    const updated = await updateProduct(req.db, productId, {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      rating,
      review_count,
      is_best_seller,
      is_featured,
    });
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  registerCustomerController,
  loginCustomerController,
  getMeController,
  loginAdminController,
  checkoutController,
  getMyOrdersController,
  getNotificationsController,
  markNotificationReadController,
  getAnalyticsSummaryController,
  getRecentSalesController,
  getTopProductsController,
  getLowStockController,
  confirmOrderController,
  cancelOrderController,
  getAdminNotificationsController,
  markAdminNotificationReadController,
  addEmployeeController,
  addProductController,
  deleteProductController,
  updateProductController,
};
