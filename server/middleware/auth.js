import User from "../models/User.js";
import jwt from "jsonwebtoken";



// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    // Check if Authorization header is provided
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token", success: false });
    }

    // Find user and exclude password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error protecting route:", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
