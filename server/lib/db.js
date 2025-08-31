import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Listeners for connection events
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
