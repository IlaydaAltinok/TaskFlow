import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getUser, clearAuth } from "../utils/auth";
import "./Boards.css";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const user = getUser();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/boards");
      setBoards(response.data.boards || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuth();
        window.location.href = "/login";
      } else {
        setError(err.response?.data?.error || "Failed to load boards");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");
      const response = await api.post("/api/boards", {
        name: newBoardName.trim(),
        description: newBoardDescription.trim() || "",
      });

      setBoards([response.data.board, ...boards]);
      setNewBoardName("");
      setNewBoardDescription("");
      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="boards-container">
        <div className="loading-message">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="boards-container">
      <header className="boards-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">TaskFlow</h1>
            <p className="user-info">
              Logged in as: <strong>{user?.email}</strong>
              {user?.name && ` (${user.name})`}
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="boards-main">
        <div className="boards-content">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="boards-actions">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary btn-large"
              >
                + Create New Board
              </button>
            ) : (
              <div className="create-board-card">
                <h3 className="card-title">Create New Board</h3>
                <form onSubmit={handleCreateBoard}>
                  <div className="form-group">
                    <label className="form-label">
                      Board Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      required
                      placeholder="Enter board name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (optional)</label>
                    <textarea
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      placeholder="Enter board description"
                      rows={3}
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={creating}
                      className="btn btn-success"
                    >
                      {creating ? "Creating..." : "Create Board"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewBoardName("");
                        setNewBoardDescription("");
                        setError("");
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {boards.length === 0 ? (
            <div className="empty-state">
              <p>No boards yet. Create your first board to get started!</p>
            </div>
          ) : (
            <div className="boards-grid">
              {boards.map((board) => (
                <Link
                  key={board._id}
                  to={`/boards/${board._id}`}
                  className="board-card-link"
                >
                  <div className="board-card">
                    <h3 className="board-card-title">{board.name}</h3>
                    {board.description && (
                      <p className="board-card-description">{board.description}</p>
                    )}
                    <div className="board-card-footer">
                      <div className="board-card-info">
                        <span className="board-card-owner">
                          Owner: {board.owner?.email || "Unknown"}
                        </span>
                        {board.members?.length > 0 && (
                          <span className="board-card-members">
                            {board.members.length} member{board.members.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
