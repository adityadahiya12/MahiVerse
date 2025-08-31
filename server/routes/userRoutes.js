import express from "express";
import {  checkAuth, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";
import bcrypt from "bcryptjs";


// RIGHT
import { signupUser, loginUser } from "../controllers/userController.js";


const userRouter = express.Router();

// ✅ Public routes
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);

// ✅ Protected routes
userRouter.get("/check-auth", protectRoute, checkAuth);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;