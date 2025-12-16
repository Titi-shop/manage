"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data: { error: string } = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 360,
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🔐 Đăng nhập</h2>

      <input
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 8,
        }}
      />

      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            paddingRight: 60,
          }}
        />

        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          style={{
            position: "absolute",
            right: 6,
            top: 6,
            fontSize: 12,
          }}
        >
          {showPass ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: 8 }}>
          {error}
        </p>
      )}

      <button
        onClick={submit}
        style={{
          width: "100%",
          padding: 10,
          fontWeight: "bold",
        }}
      >
        Đăng nhập
      </button>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
        }}
      >
        <a href="/register">Đăng ký</a>
        <a href="/forgot-password">Quên mật khẩu</a>
      </div>
    </div>
  );
}
