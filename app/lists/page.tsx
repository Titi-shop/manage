"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { List } from "@/app/types";

export default function ListsPage() {
  const router = useRouter();

  const [lists, setLists] = useState<List[]>([]);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================
     LOAD LISTS
  ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/lists", {
  credentials: "include",
  cache: "no-store",
});
        const data: List[] = await res.json();
        setLists(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =======================
     CREATE LIST
  ======================= */
  const createList = async () => {
    setError("");
    if (!name.trim()) {
      setError("Vui lòng nhập tên sổ");
      return;
    }

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const newList: List = await res.json();
    setLists([newList, ...lists]);
    setName("");
  };

  /* =======================
     DELETE LISTS
  ======================= */
  const deleteLists = async () => {
  if (selected.length === 0) return;
  const password = prompt("Nhập mật khẩu xoá:");
if (!password) return;

  for (const id of selected) {
    await fetch(`/api/lists/${id}`, {
  method: "DELETE",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: "1234" }),
});
  }

  setLists(lists.filter((l) => !selected.includes(l.id)));
  setSelected([]);
};
  /* =======================
     UI (LẤY TỪ FILE 1)
  ======================= */
  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto", paddingBottom: 70 }}>
      {/* ===== TITLE ===== */}
      <h2 style={{ marginBottom: 8 }}>📒 Danh sách sổ</h2>

      {/* ===== CREATE ===== */}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          placeholder="Tên sổ (tên danh sách...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={createList}>➕</button>
      </div>

      {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}

      {/* ===== LISTS ===== */}
      <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none" }}>
        {lists.map((l) => (
          <li
            key={l.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 0",
              borderBottom: "1px dashed #eee",
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(l.id)}
              onChange={(e) =>
                setSelected(
                  e.target.checked
                    ? [...selected, l.id]
                    : selected.filter((x) => x !== l.id)
                )
              }
            />
            <button
              onClick={() => router.push(`/list/${l.id}`)}
              style={{
                marginLeft: 8,
                border: "none",
                background: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              📁 {l.name}
            </button>
          </li>
        ))}
      </ul>

      {/* ===== DELETE ===== */}
      {selected.length > 0 && (
        <button
          onClick={deleteLists}
          style={{
            marginTop: 12,
            width: "100%",
            color: "white",
            background: "red",
            padding: 8,
          }}
        >
          🗑️ Xoá sổ đã chọn
        </button>
      )}
    </div>
  );
}
