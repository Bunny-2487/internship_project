// routes/orderRoutes.js
// place an order (checkout) and view my past orders - both need login

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/authMiddleware");

// PLACE ORDER (checkout)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty, cannot place order" });
    }

    const newOrder = new Order({
      user: req.user.id, // got this from the jwt token (authMiddleware)
      items,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error placing order" });
  }
});

// GET MY ORDERS - only logged in user's own orders
router.get("/myorders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
