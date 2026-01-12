import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Tüm route'lar JWT auth gerektirir
router.use(authMiddleware);

// POST /api/lists/:listId/tasks - Yeni task oluştur
router.post("/lists/:listId/tasks", createTask);

// PATCH /api/tasks/:taskId - Task güncelle
router.patch("/:taskId", updateTask);

// DELETE /api/tasks/:taskId - Task sil
router.delete("/:taskId", deleteTask);

export default router;

