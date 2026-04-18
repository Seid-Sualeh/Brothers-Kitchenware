const { addProduct } = require("../services/addProduct.service");

async function addProductController(req, res) {
  try {
    const {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      is_best_seller,
      is_featured,
    } = req.body;
    if (!name || !price || !image_url || !category_slug) {
      return res.status(400).json({
        error: "Name, price, image_url, and category_slug are required",
      });
    }
    const product = await addProduct(req.db, {
      name,
      description,
      price,
      image_url,
      category_slug,
      stock_quantity,
      is_best_seller,
      is_featured,
    });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addProductController };
