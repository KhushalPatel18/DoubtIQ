import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.warn("No MongoDB URI found in MONGO_URI/MONGODB_URI; skipping DB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "doubtiq",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Please check:");
    console.error("1. MongoDB Atlas network access allows your deployment IP");
    console.error("2. MONGO_URI environment variable is set correctly");
    console.error("3. MongoDB Atlas cluster is active");
    // Do not exit; allow the server to continue running
  }
};

export default connectDB;
