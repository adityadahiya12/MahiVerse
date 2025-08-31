// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ============================
// Signup
// ============================
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const user = await User.findById(createdUser._id).select("-password");

    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup Error:", error);
    const message =
      process.env.NODE_ENV === "development" ? error.message : "Server error";
    res.status(500).json({ message });
  }
};

// ============================
// Login
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userInfo = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    };

    res.json({ message: "Login successful", token, user: userInfo });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// Check Auth
// ============================
export const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ message: "Authenticated", user });
  } catch (error) {
    console.error("JWT verification error:", error);
    const message =
      process.env.NODE_ENV === "development" ? error.message : "Invalid token";
    res.status(401).json({ message });
  }
};

// ============================
// Update Profile
// ============================
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: req.user not set" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    const message =
      process.env.NODE_ENV === "development" ? error.message : "Server error";
    res.status(500).json({ message });
  }
};
