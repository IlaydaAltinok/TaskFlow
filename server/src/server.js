import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Database connection (async, uygulama başlamadan önce bağlanmaya çalışır)
connectDB().catch((err) => {
  console.error("Database connection failed on startup:", err);
  // Uygulama yine de çalışmaya devam eder
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api", listRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handlers
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  // Process'i kapatma, sadece log
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  // Kritik hatalarda process'i kapat
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

