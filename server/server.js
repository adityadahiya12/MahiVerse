import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js"; 
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const httpServer = http.createServer(app);

// ✅ CORRECT: Initialize Socket.IO with the HTTP server
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

// Store online users
export const userSocketMap = {};   // {userId: socketID}

// ✅ SINGLE Socket.IO connection handler (removed duplicate)
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId, "Socket ID:", socket.id);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  
  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle custom events
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    // Broadcast to all clients except sender
    socket.broadcast.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => {
  res.send("server is running ✅");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start server with DB connection
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();