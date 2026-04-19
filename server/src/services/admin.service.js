const bcrypt = require("bcryptjs");
const {
  initializePayment,
  mapMethodToProvider,
  sanitizeMobilePaymentDetails,
} = require("./paymentGateway.service");

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

async function createCustomer(db, { email, password, name }) {
  const hash = bcrypt.hashSync(password, 10);
  const normalizedEmail = normalizeEmail(email);
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'customer')",
    [normalizedEmail, hash, name.trim()],
  );
  return {
    id: result.insertId,
    email: normalizedEmail,
    name: name.trim(),
    role: "customer",
  };
}

async function loginCustomer(db, { email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const [rows] = await db.query(
    "SELECT id, email, password_hash, name, role FROM users WHERE email = ?",
    [normalizedEmail],
  );
  const user = rows[0];
  if (!user || user.role !== "customer") {
    return null;
  }
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function getUserById(db, userId) {
  const [rows] = await db.query(
    "SELECT id, email, name, role FROM users WHERE id = ?",
    [userId],
  );
  return rows[0] || null;
}

async function loginAdmin(db, { email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const [rows] = await db.query(
    "SELECT id, email, password_hash, name, role FROM users WHERE email = ?",
    [normalizedEmail],
  );
  const user = rows[0];
  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    return null;
  }
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function createEmployee(
  db,
  { email, password, name, role = "employee" },
) {
  const hash = bcrypt.hashSync(password, 10);
  const normalizedEmail = normalizeEmail(email);
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
    [normalizedEmail, hash, name.trim(), role],
  );
  return {
    id: result.insertId,
    email: normalizedEmail,
    name: name.trim(),
    role,
  };
}

async function getEmployees(db) {
  const [rows] = await db.query(
    "SELECT id, email, name, role FROM users WHERE role IN ('employee', 'admin') ORDER BY id",
  );
  return rows;
}

async function createProduct(db, productData) {
  const {
    name,
    description,
    price,
    image_url,
    category_slug,
    stock_quantity,
    is_best_seller,
    is_featured,
  } = productData;
  const [result] = await db.query(
    `INSERT INTO products (name, description, price, image_url, category_slug, stock_quantity, is_best_seller, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description || "",
      price,
      image_url,
      category_slug,
      stock_quantity || 50,
      is_best_seller || 0,
      is_featured || 0,
    ],
  );
  return {
    id: result.insertId,
    name,
    description,
    price,
    image_url,
    category_slug,
    stock_quantity: stock_quantity || 50,
    is_best_seller: is_best_seller || 0,
    is_featured: is_featured || 0,
  };
}

async function deleteProduct(db, productId) {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [
    productId,
  ]);
  return result.affectedRows > 0;
}

async function updateProduct(db, productId, productData) {
  const {
    name,
    description,
    price,
    image_url,
    category_slug,
    stock_quantity,
    is_best_seller,
    is_featured,
  } = productData;
  const [result] = await db.query(
    `UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_slug = ?, stock_quantity = ?, is_best_seller = ?, is_featured = ?, updated_at = NOW() WHERE id = ?`,
    [
      name,
      description || "",
      price,
      image_url,
      category_slug,
      stock_quantity || 50,
      is_best_seller || 0,
      is_featured || 0,
      productId,
    ],
  );
  return result.affectedRows > 0;
}

async function notifyAdmins(db, { type, title, body, relatedOrderId }) {
  const [admins] = await db.query(
    "SELECT id FROM users WHERE role IN ('admin','employee')",
  );
  for (const admin of admins) {
    await db.query(
      "INSERT INTO notifications (user_id, type, title, body, related_order_id) VALUES (?, ?, ?, ?, ?)",
      [admin.id, type, title, body, relatedOrderId || null],
    );
  }
}

async function notifyUser(db, userId, { type, title, body, relatedOrderId }) {
  await db.query(
    "INSERT INTO notifications (user_id, type, title, body, related_order_id) VALUES (?, ?, ?, ?, ?)",
    [userId, type, title, body, relatedOrderId || null],
  );
}

async function checkoutOrder(db, userId, items) {
  return checkoutOrderWithPayment(db, userId, { items, paymentMethod: "cash" });
}

async function checkoutOrderWithPayment(
  db,
  userId,
  { items, paymentMethod = "cash", paymentDetails = {} },
) {
  const conn = await db.getConnection();
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("items array required");
    }

    const method = String(paymentMethod || "cash").toLowerCase();
    if (!["telebirr", "mpesa", "cash"].includes(method)) {
      throw new Error("Unsupported payment method");
    }

    if (method === "telebirr" || method === "mpesa") {
      const mobileDetails = sanitizeMobilePaymentDetails(paymentDetails);
      if (
        !mobileDetails.phoneNumber ||
        !mobileDetails.fullName ||
        !mobileDetails.pin
      ) {
        throw new Error("phone number, full name, and PIN are required");
      }
    }

    // Check stock for each item
    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity) || 1;
      const [productRows] = await conn.query(
        "SELECT stock_quantity FROM products WHERE id = ?",
        [productId],
      );
      const product = productRows[0];
      if (!product || (product.stock_quantity || 0) < quantity) {
        throw new Error(`Insufficient stock for product ${productId}`);
      }
    }

    const [userRows] = await conn.query(
      "SELECT email, name FROM users WHERE id = ?",
      [userId],
    );
    const user = userRows[0];
    if (!user) {
      throw new Error("User not found");
    }

    let total = 0;
    for (const item of items) {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      total += quantity * unitPrice;
    }

    await conn.beginTransaction();
    const provider = mapMethodToProvider(method);
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, customer_email, customer_name, status, total_amount, payment_method, payment_provider) VALUES (?, ?, ?, 'processing', ?, ?, ?)",
      [userId, user.email, user.name, total, method, provider],
    );
    const orderId = orderResult.insertId;

    const payment = await initializePayment({
      provider,
      amount: total,
      orderId,
      email: user.email,
      name: user.name,
      paymentDetails,
    });
    await conn.query(
      "INSERT INTO payments (order_id, provider, amount, external_reference, status, metadata_json) VALUES (?, ?, ?, ?, ?, ?)",
      [
        orderId,
        provider,
        total,
        payment.reference,
        payment.status || "initialized",
        JSON.stringify(payment.raw || {}),
      ],
    );
    await conn.query("UPDATE orders SET payment_reference = ? WHERE id = ?", [
      payment.reference,
      orderId,
    ]);

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image_url, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          Number(item.product_id) || 0,
          String(item.name || item.product_name || "Product"),
          item.image_url || item.product_image_url || null,
          Number(item.quantity) || 1,
          Number(item.unit_price) || 0,
        ],
      );
      // Deduct stock
      const qty = Number(item.quantity) || 1;
      await conn.query(
        "UPDATE products SET stock_quantity = COALESCE(stock_quantity, 0) - ? WHERE id = ?",
        [qty, Number(item.product_id)],
      );
      const [[stock]] = await conn.query(
        "SELECT COALESCE(stock_quantity, 0) AS stock_quantity, name FROM products WHERE id = ?",
        [Number(item.product_id)],
      );
      if (stock && Number(stock.stock_quantity) <= 10) {
        await notifyAdmins(db, {
          type: "inventory_alert",
          title: "Low stock alert",
          body: `${stock.name} is low in stock (${stock.stock_quantity} remaining).`,
        });
      }
    }

    await conn.commit();
    return {
      orderId,
      status: "processing",
      totalAmount: total,
      paymentMethod: method,
      paymentReference: payment.reference,
      paymentProvider: provider,
      paymentAction: payment.action || null,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getCustomerOrders(db, userId) {
  const [orders] = await db.query(
    "SELECT id, status, total_amount, payment_method, payment_provider, payment_reference, created_at, payment_confirmed_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
  const output = [];
  for (const order of orders) {
    const [items] = await db.query(
      "SELECT id, product_id, product_name, product_image_url, quantity, unit_price FROM order_items WHERE order_id = ?",
      [order.id],
    );
    output.push({ ...order, items });
  }
  return output;
}

async function getNotifications(db, userId) {
  const [rows] = await db.query(
    "SELECT id, type, title, body, read_at, related_order_id, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    [userId],
  );
  return rows;
}

async function markNotificationRead(db, userId, notificationId) {
  await db.query(
    "UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?",
    [notificationId, userId],
  );
  return true;
}

async function getAnalyticsSummary(db) {
  const [[sales]] = await db.query(
    "SELECT COALESCE(SUM(total_amount),0) AS v FROM orders WHERE status = 'completed'",
  );
  const [[purchases]] = await db.query(
    "SELECT COALESCE(SUM(amount),0) AS v FROM purchases",
  );
  const [[expenses]] = await db.query(
    "SELECT COALESCE(SUM(amount),0) AS v FROM expenses",
  );
  const [[due]] = await db.query(
    "SELECT COALESCE(SUM(total_amount),0) AS v FROM orders WHERE status IN ('pending','processing')",
  );
  const [[returns]] = await db.query(
    "SELECT COALESCE(SUM(amount),0) AS v FROM payment_returns",
  );

  const totalSales = Number(sales.v);
  const totalPurchased = Number(purchases.v);
  const totalExpenses = Number(expenses.v);
  const invoiceDue = Number(due.v);
  const totalPaymentReturns = Number(returns.v);
  const totalProfit = totalSales - totalPurchased - totalExpenses;

  return {
    totalSales,
    totalPurchased,
    totalExpenses,
    invoiceDue,
    totalProfit,
    totalPaymentReturns,
  };
}

async function getAnalyticsTrends(db) {
  const [monthlyRows] = await db.query(
    `SELECT month_key,
            SUM(total_sales) AS total_sales,
            SUM(total_purchased) AS total_purchased,
            SUM(total_expenses) AS total_expenses
     FROM (
       SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key,
              COALESCE(SUM(total_amount), 0) AS total_sales,
              0 AS total_purchased,
              0 AS total_expenses
       FROM orders
       WHERE status = 'completed'
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       UNION ALL
       SELECT DATE_FORMAT(purchased_at, '%Y-%m') AS month_key,
              0 AS total_sales,
              COALESCE(SUM(amount), 0) AS total_purchased,
              0 AS total_expenses
       FROM purchases
       GROUP BY DATE_FORMAT(purchased_at, '%Y-%m')
       UNION ALL
       SELECT DATE_FORMAT(incurred_at, '%Y-%m') AS month_key,
              0 AS total_sales,
              0 AS total_purchased,
              COALESCE(SUM(amount), 0) AS total_expenses
       FROM expenses
       GROUP BY DATE_FORMAT(incurred_at, '%Y-%m')
     ) merged
     GROUP BY month_key
     ORDER BY month_key DESC
     LIMIT 12`,
  );

  const [statusRows] = await db.query(
    `SELECT status, COUNT(*) AS count
     FROM orders
     GROUP BY status`,
  );

  return {
    monthly: monthlyRows.reverse().map((row) => ({
      month: row.month_key,
      sales: Number(row.total_sales || 0),
      purchases: Number(row.total_purchased || 0),
      expenses: Number(row.total_expenses || 0),
    })),
    statusBreakdown: statusRows.map((row) => ({
      status: row.status,
      count: Number(row.count || 0),
    })),
  };
}

async function getRecentSales(db, period = "all") {
  let dateFilter = "";
  if (period === "today") {
    dateFilter = "AND DATE(o.created_at) = CURDATE()";
  } else if (period === "week") {
    dateFilter = "AND YEARWEEK(o.created_at, 1) = YEARWEEK(CURDATE(), 1)";
  } else if (period === "month") {
    dateFilter =
      "AND YEAR(o.created_at) = YEAR(CURDATE()) AND MONTH(o.created_at) = MONTH(CURDATE())";
  } else if (period === "year") {
    dateFilter = "AND YEAR(o.created_at) = YEAR(CURDATE())";
  }
  const [rows] = await db.query(
    `SELECT o.id, o.customer_name, o.customer_email, o.total_amount, o.status, o.created_at,
      (SELECT product_name FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id ASC LIMIT 1) AS product_name,
      (SELECT product_image_url FROM order_items oi WHERE oi.order_id = o.id ORDER BY oi.id ASC LIMIT 1) AS product_image
     FROM orders o
     WHERE 1=1 ${dateFilter}
     ORDER BY o.created_at DESC
     LIMIT 20`,
  );
  return rows;
}

async function getTopProducts(db) {
  const [rows] = await db.query(
    `SELECT oi.product_id, oi.product_name AS name,
      SUM(oi.quantity) AS units_sold,
      SUM(oi.quantity * oi.unit_price) AS revenue,
      MAX(oi.product_image_url) AS product_image
     FROM order_items oi
     INNER JOIN orders o ON o.id = oi.order_id AND o.status = 'completed'
     GROUP BY oi.product_id, oi.product_name
     ORDER BY units_sold DESC
     LIMIT 8`,
  );
  return rows;
}

async function getLowStock(db) {
  const [rows] = await db.query(
    "SELECT id, name, COALESCE(stock_quantity, 0) AS stock_quantity, image_url FROM products WHERE COALESCE(stock_quantity, 0) < 15 ORDER BY stock_quantity ASC LIMIT 10",
  );
  return rows;
}

async function finalizeOrderCompletion(db, orderId, userId, completionBody) {
  await db.query(
    "UPDATE orders SET status = 'completed', payment_confirmed_at = NOW(), updated_at = NOW() WHERE id = ?",
    [orderId],
  );
  await db.query(
    "UPDATE payments SET status = 'completed', updated_at = NOW() WHERE order_id = ?",
    [orderId],
  );

  if (userId) {
    await notifyUser(db, userId, {
      type: "payment_confirmed",
      title: "Thank you — payment confirmed",
      body: completionBody,
      relatedOrderId: orderId,
    });
  }
}

async function confirmOrder(db, orderId) {
  const [orders] = await db.query(
    "SELECT id, user_id, status FROM orders WHERE id = ?",
    [orderId],
  );
  const order = orders[0];
  if (!order) {
    return null;
  }
  if (order.status === "completed") {
    return { alreadyCompleted: true };
  }

  await finalizeOrderCompletion(
    db,
    orderId,
    order.user_id,
    `Your order #${orderId} is complete. Thanks for shopping with BK Home Goods!`,
  );

  return { orderId, status: "completed" };
}

async function confirmMobileWalletPayment(db, userId, orderId) {
  const [orders] = await db.query(
    "SELECT id, user_id, status, payment_method FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId],
  );
  const order = orders[0];
  if (!order) {
    return null;
  }
  if (order.status === "completed") {
    return { alreadyCompleted: true };
  }
  if (order.status === "cancelled") {
    return { alreadyCancelled: true };
  }
  if (!["telebirr", "mpesa"].includes(String(order.payment_method))) {
    throw new Error("Only Telebirr and M-Pesa orders can be confirmed here");
  }

  await finalizeOrderCompletion(
    db,
    orderId,
    order.user_id,
    `Your ${String(order.payment_method).toUpperCase()} payment for order #${orderId} has been confirmed successfully.`,
  );
  await notifyAdmins(db, {
    type: "mobile_payment_confirmed",
    title: "Mobile wallet payment confirmed",
    body: `Order #${orderId} was confirmed by the customer through ${String(order.payment_method).toUpperCase()}.`,
    relatedOrderId: orderId,
  });

  return {
    orderId,
    status: "completed",
    paymentMethod: order.payment_method,
  };
}

async function cancelOrder(db, orderId) {
  const [orders] = await db.query(
    "SELECT id, user_id, status FROM orders WHERE id = ?",
    [orderId],
  );
  const order = orders[0];
  if (!order) {
    return null;
  }
  if (order.status === "cancelled") {
    return { alreadyCancelled: true };
  }

  // Get order items to restore stock
  const [items] = await db.query(
    "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
    [orderId],
  );

  await db.query(
    "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = ?",
    [orderId],
  );
  await db.query(
    "UPDATE payments SET status = 'failed', updated_at = NOW() WHERE order_id = ?",
    [orderId],
  );

  // Restore stock
  for (const item of items) {
    await db.query(
      "UPDATE products SET stock_quantity = COALESCE(stock_quantity, 0) + ? WHERE id = ?",
      [item.quantity, item.product_id],
    );
  }

  if (order.user_id) {
    await notifyUser(db, order.user_id, {
      type: "order_cancelled",
      title: "Order Cancelled",
      body: `Your order #${orderId} has been cancelled.`,
      relatedOrderId: orderId,
    });
  }

  return { orderId, status: "cancelled" };
}

async function getAdminNotifications(db, staffId) {
  const [rows] = await db.query(
    "SELECT id, type, title, body, read_at, related_order_id, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    [staffId],
  );
  return rows;
}

async function markAdminNotificationRead(db, staffId, notificationId) {
  await db.query(
    "UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?",
    [notificationId, staffId],
  );
  return true;
}

module.exports = {
  createCustomer,
  loginCustomer,
  getUserById,
  loginAdmin,
  createEmployee,
  getEmployees,
  createProduct,
  deleteProduct,
  updateProduct,
  notifyAdmins,
  notifyUser,
  checkoutOrder,
  checkoutOrderWithPayment,
  getCustomerOrders,
  getNotifications,
  markNotificationRead,
  getAnalyticsSummary,
  getAnalyticsTrends,
  getRecentSales,
  getTopProducts,
  getLowStock,
  confirmOrder,
  confirmMobileWalletPayment,
  cancelOrder,
  getAdminNotifications,
  markAdminNotificationRead,
};
