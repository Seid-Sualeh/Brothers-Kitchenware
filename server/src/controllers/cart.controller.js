const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../services/cart.service");

async function getCartController(req, res) {
  try {
    const userId = req.user.sub;
    const cart = await getCart(req.db, userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addToCartController(req, res) {
  try {
    const userId = req.user.sub;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: "Valid productId and quantity required" });
    }

    const cartItem = await addToCart(req.db, userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (err) {
    if (err.message === "Product not found" || err.message === "Insufficient stock") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

async function updateCartItemController(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cartItem = await updateCartItem(req.db, userId, parseInt(id), quantity);
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeFromCartController(req, res) {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    const success = await removeFromCart(req.db, userId, parseInt(id));
    if (!success) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function clearCartController(req, res) {
  try {
    const userId = req.user.sub;
    await clearCart(req.db, userId);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
};
