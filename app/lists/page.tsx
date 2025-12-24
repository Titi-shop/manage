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

  const deleteLists = async () => {
    if (selected.length === 0) return;

    const password = prompt("Nhập mật khẩu xoá:");
    if (!password) return;

    for (const id of selected) {
      await fetch(`/api/lists/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    }

    setLists(lists.filter((l) => !selected.includes(l.id)));
    setSelected([]);
  };

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 520,
        margin: "0 auto",
        paddingBottom: 80,
      }}
    >
      {/* ===== TITLE ===== */}
      <h2 style={{ marginBottom: 12, fontSize: 22 }}>📒 Danh sách sổ</h2>

      {/* ===== CREATE ===== */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Tên sổ..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={createList}
          style={{
            fontSize: 20,
            padding: "8px 14px",
            borderRadius: 8,
          }}
        >
          ➕
        </button>
      </div>

      {error && (
        <p style={{ color: "red", fontSize: 14, marginTop: 6 }}>{error}</p>
      )}

      {/* ===== LISTS ===== */}
      <ul
        style={{
          marginTop: 18,
          paddingLeft: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {lists.map((l) => (
          <li
            key={l.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: 12,
              borderRadius: 10,
              border: "1px solid #e5e5e5",
              background: "#fafafa",
            }}
          >
            <input
              type="checkbox"
              style={{ width: 22, height: 22 }}
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
                marginLeft: 12,
                border: "none",
                background: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 18,
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
            marginTop: 16,
            width: "100%",
            color: "white",
            background: "red",
            padding: 12,
            borderRadius: 10,
            fontSize: 16,
          }}
        >
          🗑️ Xoá {selected.length} sổ đã chọn
        </button>
      )}
    </div>
  );
}
