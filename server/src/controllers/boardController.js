import Board from "../models/Board.js";
import List from "../models/List.js";

// GET /api/boards - Kullanıcının tüm board'larını getir
export const getBoards = async (req, res) => {
  try {
    const userId = req.user._id;

    const boards = await Board.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "email name")
      .populate("members", "email name")
      .sort({ updatedAt: -1 });

    res.json({ boards });
  } catch (error) {
    console.error("Get boards error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/boards - Yeni board oluştur
export const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Board name is required" });
    }

    const board = new Board({
      name: name.trim(),
      description: description?.trim() || "",
      owner: userId,
      members: [],
    });

    await board.save();
    await board.populate("owner", "email name");

    res.status(201).json({ board });
  } catch (error) {
    console.error("Create board error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/boards/:boardId - Tek board getir
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate("owner", "email name")
      .populate("members", "email name");

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Lists'leri de getir
    const lists = await List.find({ board: board._id })
      .populate({
        path: "tasks",
        populate: { path: "assignedTo", select: "email name" },
      })
      .sort({ order: 1 })
      .lean();

    // Virtual field'ları populate et
    for (let list of lists) {
      const Task = (await import("../models/Task.js")).default;
      list.tasks = await Task.find({ list: list._id })
        .populate("assignedTo", "email name")
        .sort({ order: 1 });
    }

    res.json({ board, lists });
  } catch (error) {
    console.error("Get board error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/boards/:boardId - Board güncelle
export const updateBoard = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const board = req.board; // middleware'den geliyor
    const isOwner = req.isOwner; // middleware'den geliyor

    // Sadece owner güncelleyebilir
    if (!isOwner) {
      return res.status(403).json({ error: "Only owner can update board" });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: "Board name cannot be empty" });
      }
      board.name = name.trim();
    }

    if (description !== undefined) {
      board.description = description?.trim() || "";
    }

    if (members !== undefined && Array.isArray(members)) {
      board.members = members;
    }

    await board.save();
    await board.populate("owner", "email name");
    await board.populate("members", "email name");

    res.json({ board });
  } catch (error) {
    console.error("Update board error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/boards/:boardId - Board sil
export const deleteBoard = async (req, res) => {
  try {
    const board = req.board;
    const isOwner = req.isOwner;

    // Sadece owner silebilir
    if (!isOwner) {
      return res.status(403).json({ error: "Only owner can delete board" });
    }

    // İlişkili list ve task'ları da sil
    const lists = await List.find({ board: board._id });
    const listIds = lists.map((list) => list._id);

    // Task'ları sil (eğer Task modeli varsa)
    const Task = (await import("../models/Task.js")).default;
    await Task.deleteMany({ list: { $in: listIds } });

    // List'leri sil
    await List.deleteMany({ board: board._id });

    // Board'u sil
    await Board.findByIdAndDelete(board._id);

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Delete board error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

