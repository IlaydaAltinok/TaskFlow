import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";

  if (!process.env.MONGO_URI) {
    console.warn("⚠️  MONGO_URI not set in environment variables");
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Error details:", {
      name: error.name,
      code: error.code,
    });
    // Uygulama crash etmesin, sadece uyarı ver
    console.warn("⚠️  Database connection failed. App will continue but database features won't work.");
  }
};

export default connectDB;

