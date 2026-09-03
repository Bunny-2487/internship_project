// models/Product.js
// schema for products that will show up on the website

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // just storing a url/link to image, keeping it simple
    default: "https://via.placeholder.com/200",
  },
  category: {
    type: String,
    default: "general",
  },
  stock: {
    type: Number,
    default: 10,
  },
});

module.exports = mongoose.model("Product", productSchema);
