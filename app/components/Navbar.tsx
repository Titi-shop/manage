<div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderBottom: "1px solid #ddd"
}}>
  <div>
    👤 <strong>{username}</strong>
  </div>

  <div style={{ display: "flex", gap: 8 }}>
    <button onClick={toggleHide}>
      {hidden ? "👁 Hiện" : "🙈 Ẩn"}
    </button>

    <button onClick={() => router.push("/change-password")}>
      🔐 Đổi MK
    </button>

    <button onClick={logout} style={{ color: "red" }}>
      🚪 Thoát
    </button>
  </div>
</div>
