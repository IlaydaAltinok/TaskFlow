import Board from "../models/Board.js";

// User'ın board'a erişim yetkisi var mı kontrol et
export const checkBoardAccess = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.body.boardId;
    const userId = req.user._id;

    if (!boardId) {
      return res.status(400).json({ error: "Board ID is required" });
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Owner veya member kontrolü
    const isOwner = board.owner.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Access denied to this board" });
    }

    // Board'u request'e ekle (sonraki middleware'lerde kullanmak için)
    req.board = board;
    req.isOwner = isOwner;

    next();
  } catch (error) {
    console.error("Board access check error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

