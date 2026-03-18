const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const { email, password } = req.body;

  // 🔴 Validation
  if (!email || !password) {
    return res.json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      return res.json({
        success: true,
        message: "Login successful",
        user
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);

  const { firstName, lastName, email, password } = req.body;

  // 🔴 Validation
  if (!firstName || !lastName || !email || !password) {
    return res.json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });

    await newUser.save();

    return res.json({
      success: true,
      message: "User registered successfully"
    });

  } catch (err) {
    console.log("Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ✅ IMPORTANT
module.exports = router;