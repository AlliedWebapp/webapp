const asyncHandler = require('express-async-handler'); // Middleware for async error handling
const jwt = require('jsonwebtoken'); // JWT for authentication
const bcrypt = require('bcryptjs'); // Password hashing library

const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // Destructure request body params

  console.log("📝 Registering new user:", email);

  // Validation
  if (!name || !email || !password) {
    console.warn("⚠️ Missing required fields");
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.warn("⚠️ User already exists:", email);
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10); // Generate salt (10 rounds)
  const hashedPassword = await bcrypt.hash(password, salt); // Hash password

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    console.log("✅ User registered successfully:", user.email);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    console.error("❌ User registration failed");
    res.status(400);
    throw new Error("User could not be created");
  }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // Destructure request body

  console.log("🔑 Login attempt:", email);

  const user = await User.findOne({ email });

  if (!user) {
    console.warn("⚠️ No user found with this email:", email);
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.warn("⚠️ Incorrect password for:", email);
    res.status(400);
    throw new Error("Invalid credentials");
  }

  console.log("✅ Login successful:", user.email);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  console.log("👤 Fetching profile for:", req.user.email);

  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };

  res.status(200).json(user);
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expiration
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
