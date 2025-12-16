"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ chỉ thêm state hiển thị mật khẩu
  const [showPass, setShowPass] = useState(false);

  const submit = async () => {
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data: { error: string } = await res.json();
      setError(data.error);
      return;
    }

    router.push("/login");
  };

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <h2>Đăng ký</h2>

      <input
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      {/* ===== MẬT KHẨU + HIỂN THỊ ===== */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          type={showPass ? "text" : "password"}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", paddingRight: 40 }}
        />

        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          style={{
            position: "absolute",
            right: 6,
            top: 4,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={submit}>Đăng ký</button>

      <p style={{ marginTop: 12 }}>
        Đã có tài khoản?{" "}
        <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
}
