import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getUser, isAuthenticated, clearAuth } from "../utils/auth";

export default function Home() {
  const [status, setStatus] = useState("loading...");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // API health check
    const base = import.meta.env.VITE_API_URL;
    fetch(`${base}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data?.status ?? "unknown"))
      .catch(() => setStatus("backend not reachable"));

    // User bilgisini al
    if (isAuthenticated()) {
      const storedUser = getUser();
      setUser(storedUser);

      // Backend'den güncel user bilgisini al (opsiyonel)
      api
        .get("/api/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // Token geçersizse temizle
          clearAuth();
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 1200, margin: "0 auto", backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#1a1a1a" }}>TaskFlow</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>API health: <strong style={{ color: status === "ok" ? "#28a745" : "#dc3545" }}>{status}</strong></p>

      {user ? (
        <div style={{ marginTop: 24, padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <p style={{ marginBottom: "12px", color: "#333" }}>
            <strong>Logged in as:</strong> {user.email}
            {user.name && ` (${user.name})`}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              to="/boards"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
            >
              Go to Boards
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 24, padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <p style={{ marginBottom: "16px", color: "#333" }}>You are not logged in.</p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              to="/login"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#218838"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#28a745"}
            >
              Register
            </Link>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

