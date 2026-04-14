async function addProduct(db, productData) {
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
  } = productData;
  const [result] = await db.query(
    `INSERT INTO products (name, description, price, image_url, category_slug, stock_quantity, rating, review_count, is_best_seller, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity || 50,
      rating || 0,
      review_count || 0,
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
    rating: rating || 0,
    review_count: review_count || 0,
    is_best_seller: is_best_seller || 0,
    is_featured: is_featured || 0,
  };
}

module.exports = { addProduct };
