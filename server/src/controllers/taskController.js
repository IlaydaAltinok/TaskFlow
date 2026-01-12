import Task from "../models/Task.js";
import List from "../models/List.js";
import Board from "../models/Board.js";

// POST /api/lists/:listId/tasks - Yeni task oluştur
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;
    const listId = req.params.listId;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Task title is required" });
    }

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

    // Aynı list'te kaç task var (order için)
    const taskCount = await Task.countDocuments({ list: listId });

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      list: listId,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      priority: priority || "medium",
      status: "todo",
      order: taskCount,
    });

    await task.save();
    await task.populate("assignedTo", "email name");

    res.status(201).json({ task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/tasks/:taskId - Task güncelle
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status, order } =
      req.body;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId).populate({
      path: "list",
      populate: { path: "board" },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Board erişim kontrolü
    const board = task.list.board;
    const userId = req.user._id;
    const isOwner = board.owner.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: "Task title cannot be empty" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description?.trim() || "";
    }

    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    if (priority !== undefined) {
      if (!["low", "medium", "high"].includes(priority)) {
        return res.status(400).json({ error: "Invalid priority value" });
      }
      task.priority = priority;
    }

    if (status !== undefined) {
      if (!["todo", "in-progress", "done"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      task.status = status;
    }

    if (order !== undefined) {
      task.order = order;
    }

    await task.save();
    await task.populate("assignedTo", "email name");

    res.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/tasks/:taskId - Task sil
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId).populate({
      path: "list",
      populate: { path: "board" },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Board erişim kontrolü
    const board = task.list.board;
    const userId = req.user._id;
    const isOwner = board.owner.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

