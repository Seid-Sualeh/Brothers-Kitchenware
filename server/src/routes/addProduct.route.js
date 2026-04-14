const express = require("express");
const {
  addProductController,
} = require("../controllers/addProduct.controller");

const router = express.Router();

router.post("/add-product", addProductController);

module.exports = router;
