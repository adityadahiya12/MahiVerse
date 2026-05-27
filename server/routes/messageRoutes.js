import express from "express";
import { protectRoute } from "../middleware/auth.js";

import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get sidebar users
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get chat messages
messageRouter.get("/:id", protectRoute, getMessages);

// Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send message
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;