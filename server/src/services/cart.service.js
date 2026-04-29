async function getCart(db, userId) {
  const [rows] = await db.query(`
    SELECT
      ci.id,
      ci.quantity,
      ci.created_at,
      p.id as product_id,
      p.name,
      p.price,
      p.image_url,
      p.stock_quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at ASC
  `, [userId]);

  return rows.map(item => ({
    id: item.product_id,
    name: item.name,
    price: item.price,
    image_url: item.image_url,
    stock_quantity: item.stock_quantity,
    quantity: item.quantity,
    cart_item_id: item.id,
  }));
}

async function addToCart(db, userId, productId, quantity) {
  // Check if product exists and has stock
  const [products] = await db.query(
    "SELECT id, name, price, image_url, stock_quantity FROM products WHERE id = ?",
    [productId]
  );

  if (!products.length) {
    throw new Error("Product not found");
  }

  const product = products[0];
  if (product.stock_quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  // Check if item already in cart
  const [existing] = await db.query(
    "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );

  if (existing.length) {
    // Update quantity
    const newQuantity = existing[0].quantity + quantity;
    if (product.stock_quantity < newQuantity) {
      throw new Error("Insufficient stock");
    }

    await db.query(
      "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newQuantity, existing[0].id]
    );

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      quantity: newQuantity,
      cart_item_id: existing[0].id,
    };
  } else {
    // Insert new item
    const [result] = await db.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, productId, quantity]
    );

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      quantity: quantity,
      cart_item_id: result.insertId,
    };
  }
}

async function updateCartItem(db, userId, cartItemId, quantity) {
  // Check if cart item belongs to user
  const [existing] = await db.query(
    "SELECT ci.id, ci.product_id, p.stock_quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ? AND ci.user_id = ?",
    [cartItemId, userId]
  );

  if (!existing.length) {
    return null;
  }

  if (existing[0].stock_quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  await db.query(
    "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [quantity, cartItemId]
  );

  return { id: cartItemId, quantity };
}

async function removeFromCart(db, userId, cartItemId) {
  const [result] = await db.query(
    "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
    [cartItemId, userId]
  );

  return result.affectedRows > 0;
}

async function clearCart(db, userId) {
  await db.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
