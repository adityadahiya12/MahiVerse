import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cloudinary from "./lib/cloudinary.js";

const app = express();
const httpServer = http.createServer(app);

// Socket.IO setup
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId, "Socket ID:", socket.id);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Receive message
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    socket.broadcast.emit("receiveMessage", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.send("MahiVerse Backend Running 🚀");
});

app.get("/api/status", (req, res) => {
  res.send("Server is running ✅");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();

// Export for deployment
export default app;