import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// In-memory storage for testing (when MongoDB is not available)
let inMemoryUsers = [];
let userIdCounter = 1;

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Server error
 */
// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists (in-memory or database)
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (dbError) {
      // If database is not available, check in-memory storage
      existingUser = inMemoryUsers.find(user => user.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
      });
    } catch (dbError) {
      // If database is not available, use in-memory storage
      const hashedPassword = await import('bcryptjs').then(bcrypt => bcrypt.default.hash(password, 10));
      user = {
        _id: userIdCounter++,
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      };
      inMemoryUsers.push(user);
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request - invalid credentials or validation error
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user with password field
    let user;
    try {
      user = await User.findOne({ email }).select("+password");
    } catch (dbError) {
      // If database is not available, check in-memory storage
      user = inMemoryUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    let isMatch;
    try {
      const bcrypt = await import('bcryptjs');
      isMatch = await bcrypt.default.compare(password, user.password);
    } catch (bcryptError) {
      return res.status(500).json({ message: "Password verification error" });
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
