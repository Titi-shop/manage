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

  useEffect(() => {
    fetch("/api/lists")
      .then(res => res.json())
      .then(setLists)
      .finally(() => setLoading(false));
  }, []);

  const createList = async () => {
    if (!name.trim()) return;

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const newList: List = await res.json();
    setLists([newList, ...lists]);
    setName("");
  };

  if (loading) return <p style={{ padding: 24 }}>Đang tải…</p>;

  return (
    <div style={{ padding: 16, paddingBottom: 70 }}>
      <h2>📒 Danh sách sổ</h2>

      <div style={{ display: "flex", gap: 6 }}>
        <input
          placeholder="Tên sổ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={createList}>➕</button>
      </div>

      <ul style={{ marginTop: 16, listStyle: "none", padding: 0 }}>
        {lists.map(l => (
          <li
            key={l.id}
            style={{ padding: 8, borderBottom: "1px dashed #ddd" }}
            onClick={() => router.push(`/list/${l.id}`)}
          >
            📁 {l.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
