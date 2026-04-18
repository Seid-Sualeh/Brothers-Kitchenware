async function addProduct(db, productData) {
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
      description,
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

module.exports = { addProduct };
