"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // 👁 hiển thị / ẩn mật khẩu
  const [show, setShow] = useState(false);

  const submit = async () => {
    setError("");
    setOk("");

    if (newPass !== confirm) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: oldPass,
        newPassword: newPass,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Lỗi");
      return;
    }

    setOk("✅ Đổi mật khẩu thành công");
    setOldPass("");
    setNewPass("");
    setConfirm("");
  };

  const inputType = show ? "text" : "password";

  return (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <button
        onClick={() => router.back()}
        style={{ marginBottom: 12 }}
      >
        ← Quay lại
      </button>

      <h2>🔐 Đổi mật khẩu</h2>

      <input
        type={inputType}
        placeholder="Mật khẩu hiện tại"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <input
        type={inputType}
        placeholder="Mật khẩu mới"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <input
        type={inputType}
        placeholder="Nhập lại mật khẩu mới"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ width: "100%" }}
      />

      {/* 👁 toggle */}
      <div style={{ marginTop: 6 }}>
        <label style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            checked={show}
            onChange={() => setShow(!show)}
          />{" "}
          Hiển thị mật khẩu
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {ok && <p style={{ color: "green" }}>{ok}</p>}

      <button onClick={submit} style={{ marginTop: 10 }}>
        💾 Lưu
      </button>
    </div>
  );
}
