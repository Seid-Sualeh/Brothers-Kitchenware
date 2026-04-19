const express = require("express");
const { requireDatabase } = require("../middleware/requireDatabase");
const { authCustomer, authStaff, requireAdmin } = require("../utils/auth");
const {
  registerCustomerController,
  loginCustomerController,
  getMeController,
  loginAdminController,
  checkoutController,
  getMyOrdersController,
  getNotificationsController,
  markNotificationReadController,
  getAnalyticsSummaryController,
  getAnalyticsTrendsController,
  getRecentSalesController,
  getTopProductsController,
  getLowStockController,
  confirmOrderController,
  confirmMobileWalletPaymentController,
  cancelOrderController,
  getAdminNotificationsController,
  markAdminNotificationReadController,
   addEmployeeController,
   getEmployeesController,
   addProductController,
  deleteProductController,
  updateProductController,
  sendMarketingController,
} = require("../controllers/admin.controller");

module.exports = function createAdminRouter(getCtx) {
  const router = express.Router();
  const requireDb = requireDatabase(getCtx);

  router.post("/auth/register", requireDb, registerCustomerController);
  router.post("/auth/login", requireDb, loginCustomerController);
  router.get("/auth/me", requireDb, authCustomer, getMeController);
  router.post("/admin/auth/login", requireDb, loginAdminController);
  // Temporary debug endpoint - remove after fixing
  router.get("/debug/users", requireDb, async (req, res) => {
    try {
      const [users] = await req.db.query("SELECT id, email, name, role FROM users");
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/orders/checkout", requireDb, authCustomer, checkoutController);
  router.get("/orders/my", requireDb, authCustomer, getMyOrdersController);
  router.patch(
    "/orders/:id/mobile-confirm",
    requireDb,
    authCustomer,
    confirmMobileWalletPaymentController,
  );
  router.get(
    "/me/notifications",
    requireDb,
    authCustomer,
    getNotificationsController,
  );
  router.patch(
    "/me/notifications/:id/read",
    requireDb,
    authCustomer,
    markNotificationReadController,
  );

  router.get(
    "/admin/analytics/summary",
    requireDb,
    authStaff,
    getAnalyticsSummaryController,
  );
  router.get(
    "/admin/analytics/trends",
    requireDb,
    authStaff,
    getAnalyticsTrendsController,
  );
  router.get(
    "/admin/dashboard/recent-sales",
    requireDb,
    authStaff,
    getRecentSalesController,
  );
  router.get(
    "/admin/dashboard/top-products",
    requireDb,
    authStaff,
    getTopProductsController,
  );
  router.get(
    "/admin/dashboard/low-stock",
    requireDb,
    authStaff,
    getLowStockController,
  );

  router.patch(
    "/admin/orders/:id/confirm",
    requireDb,
    authStaff,
    requireAdmin,
    confirmOrderController,
  );
  router.patch(
    "/admin/orders/:id/cancel",
    requireDb,
    authStaff,
    requireAdmin,
    cancelOrderController,
  );

  router.get(
    "/admin/notifications",
    requireDb,
    authStaff,
    getAdminNotificationsController,
  );
  router.patch(
    "/admin/notifications/:id/read",
    requireDb,
    authStaff,
    markAdminNotificationReadController,
  );

  router.post(
    "/admin/employees",
    requireDb,
    authStaff,
    requireAdmin,
    addEmployeeController,
  );
  router.post(
    "/admin/marketing/send",
    requireDb,
    authStaff,
    requireAdmin,
    sendMarketingController,
  );
  router.post("/admin/products", requireDb, authStaff, addProductController);
  router.get("/admin/products/:id", requireDb, authStaff, async (req, res) => {
    try {
      const productId = Number(req.params.id);
      if (!productId) {
        return res.status(400).json({ error: "Product ID required" });
      }
      const [rows] = await req.db.query("SELECT * FROM products WHERE id = ?", [
        productId,
      ]);
      const product = rows[0];
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.put(
    "/admin/products/:id",
    requireDb,
    authStaff,
    updateProductController,
  );
  router.delete(
    "/admin/products/:id",
    requireDb,
    authStaff,
    deleteProductController,
  );

  return router;
};
