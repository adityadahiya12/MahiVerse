// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// ============================
// Signup
// ============================
export const signupUser = async (req, res) => {
  try {
    // FIXED: Added 'bio' to be destructured from the request body.
    const { fullName, email, password, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists", success: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio, // FIXED: Pass the bio to the new user document.
    });

    const user = await User.findById(createdUser._id).select("-password");

    // After creating the user, generate a token to log them in automatically.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });

    res.status(201).json({ 
      message: "Signup successful", 
      user, 
      token, // Send the token back to the client
      success: true 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    const message =
      process.env.NODE_ENV === "development" ? error.message : "Server error";
    res.status(500).json({ message, success: false });
  }
};

// ============================
// Login
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userInfo = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
    };

    res.json({ message: "Login successful", token, user: userInfo, success: true });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ============================
// Check Auth
// ============================
export const checkAuth = async (req, res) => {
  try {
    // The protectRoute middleware already handles token verification and user fetching.
    res.json({ message: "Authenticated", user: req.user, success: true });

  } catch (error) {
    console.error("Check Auth Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


// ============================
// Update Profile
// ============================
export const updateProfile = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);

    const { fullName, bio, profilePic } = req.body;

    const userId = req.user._id;

    let updatedFields = {
      fullName,
      bio,
    };

    // Upload image if exists
    if (profilePic) {

      console.log("Uploading image to Cloudinary...");

      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "mahiverse_profiles",
      });

      console.log("Cloudinary Success:", uploadResponse.secure_url);

      updatedFields.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    console.log("FULL UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

