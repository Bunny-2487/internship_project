// seed.js
// run this once with "node seed.js" to fill the database with some sample products
// just so the website isn't empty when we open it

const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const sampleProducts = [
  {
    name: "Wireless Headphones",
    description: "Comfortable over-ear headphones with good bass",
    price: 1499,
    image: "https://via.placeholder.com/200?text=Headphones",
    category: "electronics",
    stock: 15,
  },
  {
    name: "Smart Watch",
    description: "Tracks steps, heart rate and notifications",
    price: 2299,
    image: "https://via.placeholder.com/200?text=Smart+Watch",
    category: "electronics",
    stock: 10,
  },
  {
    name: "Cotton T-Shirt",
    description: "100% cotton, available in many colors",
    price: 499,
    image: "https://via.placeholder.com/200?text=T-Shirt",
    category: "fashion",
    stock: 30,
  },
  {
    name: "Backpack",
    description: "Spacious laptop backpack for college and travel",
    price: 999,
    image: "https://via.placeholder.com/200?text=Backpack",
    category: "fashion",
    stock: 20,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with great sound quality",
    price: 1299,
    image: "https://via.placeholder.com/200?text=Speaker",
    category: "electronics",
    stock: 12,
  },
  {
    name: "Notebook Set (Pack of 3)",
    description: "Ruled notebooks, good for college notes",
    price: 199,
    image: "https://via.placeholder.com/200?text=Notebooks",
    category: "stationery",
    stock: 50,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB, adding sample products...");
    await Product.deleteMany(); // clear old products first
    await Product.insertMany(sampleProducts);
    console.log("Sample products added successfully!");
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error: ", err));
