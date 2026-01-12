import express from "express";
import authMiddleware from "../middleware/auth.js";
import { checkBoardAccess } from "../middleware/boardAuth.js";
import {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";

const router = express.Router();

// Tüm route'lar JWT auth gerektirir
router.use(authMiddleware);

// GET /api/boards - Kullanıcının board'ları
router.get("/", getBoards);

// POST /api/boards - Yeni board oluştur
router.post("/", createBoard);

// GET /api/boards/:boardId - Tek board getir
router.get("/:boardId", checkBoardAccess, getBoard);

// PATCH /api/boards/:boardId - Board güncelle
router.patch("/:boardId", checkBoardAccess, updateBoard);

// DELETE /api/boards/:boardId - Board sil
router.delete("/:boardId", checkBoardAccess, deleteBoard);

export default router;

