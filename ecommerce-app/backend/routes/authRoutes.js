// routes/authRoutes.js
// handles user signup and login, using bcrypt for password hashing and jwt for tokens

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER - create a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic check so we don't save empty fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // hash the password before saving (never save plain text passwords!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong on server" });
  }
});

// LOGIN - check user and give back a jwt token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare entered password with hashed password in db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create jwt token, it expires in 1 day
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong on server" });
  }
});

module.exports = router;
