const express = require("express");
const { requireDatabase } = require("../middleware/requireDatabase");
const { authCustomer } = require("../utils/auth");
const {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} = require("../controllers/cart.controller");

const router = express.Router();
const requireDb = requireDatabase(() => ({ pool: null, dbReady: false }));

router.get("/", requireDb, authCustomer, getCartController);
router.post("/", requireDb, authCustomer, addToCartController);
router.patch("/:id", requireDb, authCustomer, updateCartItemController);
router.delete("/:id", requireDb, authCustomer, removeFromCartController);
router.delete("/", requireDb, authCustomer, clearCartController);

module.exports = router;
