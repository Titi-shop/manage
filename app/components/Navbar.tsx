"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [showUser, setShowUser] = useState(false); // ✅ MẶC ĐỊNH ẨN
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD USER
  ======================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          setUsername("");
          return;
        }
        const u = await res.json();
        setUsername(u.username);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* =======================
     LOGOUT
  ======================= */
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  // ⛔ chưa load xong thì không render
  if (loading || !username) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderBottom: "1px solid #ddd",
        fontSize: 14,
      }}
    >
      {/* 👤 USER */}
      <div>
        👤 <strong>{showUser ? username : "••••••"}</strong>
        <button
          onClick={() => setShowUser(!showUser)}
          style={{ marginLeft: 6, fontSize: 12 }}
        >
          {showUser ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          style={{ fontSize: 12 }}
          onClick={() => router.push("/change-password")}
        >
          🔐 Đổi MK
        </button>

        <button
          style={{ fontSize: 12, color: "red" }}
          onClick={logout}
        >
          Thoát
        </button>
      </div>
    </div>
  );
}
