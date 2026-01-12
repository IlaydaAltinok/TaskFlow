import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

// JWT token oluşturma helper
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

const ensureDbConnected = () => {
  // readyState 1: connected
  if (mongoose.connection.readyState !== 1) {
    return false;
  }
  return true;
};

// Register
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!ensureDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Email format kontrolü (basit)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password uzunluk kontrolü
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      email: email.toLowerCase(),
      passwordHash: password, // pre-save hook hashleyecek
      name: name || undefined,
    });

    await user.save();

    // Token oluştur
    const token = generateToken(user._id);

    // Response (passwordHash'i gönderme)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    if (error.code === 11000) {
      // Duplicate key error (email unique constraint)
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ 
      error: "Server error during registration",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!ensureDbConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Password kontrolü
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.error("Login failed: Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Token oluştur
    const token = generateToken(user._id);

    // Response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get current user (me)
export const getMe = async (req, res) => {
  try {
    // req.user middleware'den geliyor
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

