"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const Item = ({
    icon,
    label,
    path,
  }: {
    icon: string;
    label: string;
    path: string;
  }) => {
    const active = pathname === path;
    return (
      <button
        onClick={() => router.push(path)}
        style={{
          flex: 1,
          border: "none",
          background: "none",
          padding: 6,
          fontSize: 12,
          color: active ? "#0070f3" : "#555",
        }}
      >
        <div style={{ fontSize: 20 }}>{icon}</div>
        <div>{label}</div>
      </button>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        display: "flex",
        borderTop: "1px solid #ddd",
        background: "#fff",
        zIndex: 100,
      }}
    >
      {/* 🏠 HOME */}
      <Item icon="🏠" label="Home" path="/" />

      {/* 🖼️ ẢNH */}
      <Item icon="🖼️" label="Ảnh" path="/media/images" />

      {/* 🎥 VIDEO */}
      <Item icon="🎥" label="Video" path="/media/videos" />

      {/* 📒 DANH SÁCH SỔ */}
      <Item icon="📒" label="Sổ" path="/lists" />

      {/* 📎 TỆP */}
      <Item icon="📎" label="Tệp" path="/files" />
    </div>
  );
}
