import express from "express";
import authMiddleware from "../middleware/auth.js";
import { checkBoardAccess } from "../middleware/boardAuth.js";
import {
  createList,
  updateList,
  deleteList,
} from "../controllers/listController.js";

const router = express.Router();

// Tüm route'lar JWT auth gerektirir
router.use(authMiddleware);

// POST /api/boards/:boardId/lists - Yeni list oluştur
router.post("/boards/:boardId/lists", checkBoardAccess, createList);

// PATCH /api/lists/:listId - List güncelle
router.patch("/:listId", updateList);

// DELETE /api/lists/:listId - List sil
router.delete("/:listId", deleteList);

export default router;

