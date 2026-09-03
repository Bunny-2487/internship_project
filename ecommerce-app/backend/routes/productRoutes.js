// routes/productRoutes.js
// CRUD routes for products. Get is public, add/delete need login (just for demo)

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/authMiddleware");

// GET all products - anyone can see products, no login needed
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET single product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// ADD new product - needs login (protected route, just for admin/demo purpose)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// DELETE product - protected too
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
