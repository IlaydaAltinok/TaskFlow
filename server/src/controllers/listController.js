import List from "../models/List.js";
import Board from "../models/Board.js";
import Task from "../models/Task.js";

// POST /api/boards/:boardId/lists - Yeni list oluştur
export const createList = async (req, res) => {
  try {
    const { name } = req.body;
    const boardId = req.params.boardId;
    const board = req.board; // middleware'den geliyor

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "List name is required" });
    }

    // Aynı board'ta kaç list var (order için)
    const listCount = await List.countDocuments({ board: boardId });

    const list = new List({
      name: name.trim(),
      board: boardId,
      order: listCount,
    });

    await list.save();

    res.status(201).json({ list });
  } catch (error) {
    console.error("Create list error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/lists/:listId - List güncelle
export const updateList = async (req, res) => {
  try {
    const { name, order } = req.body;
    const listId = req.params.listId;

    const list = await List.findById(listId).populate("board");

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Board erişim kontrolü
    const board = list.board;
    const userId = req.user._id;
    const isOwner = board.owner.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: "List name cannot be empty" });
      }
      list.name = name.trim();
    }

    if (order !== undefined) {
      list.order = order;
    }

    await list.save();

    res.json({ list });
  } catch (error) {
    console.error("Update list error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/lists/:listId - List sil
export const deleteList = async (req, res) => {
  try {
    const listId = req.params.listId;

    const list = await List.findById(listId).populate("board");

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Board erişim kontrolü
    const board = list.board;
    const userId = req.user._id;
    const isOwner = board.owner.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    // İlişkili task'ları sil
    await Task.deleteMany({ list: listId });

    // List'i sil
    await List.findByIdAndDelete(listId);

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Delete list error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

