"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  text: string;
  time: string;
}

export default function NotesPage() {
  const router = useRouter();
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD NOTES
  ======================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetch(`/api/notes?date=${date}`, {
        cache: "no-store",
        credentials: "include", // 🔥
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setNotes(data);
      setLoading(false);
    };

    load();
  }, [date, router]);

  /* =======================
     SAVE NOTES
  ======================= */
  const saveNotes = async (newNotes: Note[]) => {
    setNotes(newNotes);

    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔥
      body: JSON.stringify({ date, notes: newNotes }),
    });
  };

  /* =======================
     ADD NOTE
  ======================= */
  const addNote = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const newNote: Note = {
      id: Date.now(),
      text: input,
      time: now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [newNote, ...notes];
    setInput("");
    await saveNotes(updated);
  };

  /* =======================
     DELETE NOTE
  ======================= */
  const deleteNote = async (id: number) => {
    const updated = notes.filter((n) => n.id !== id);
    await saveNotes(updated);
  };

  if (loading) return <p style={{ padding: 24 }}>Đang tải ghi chú…</p>;

  /* =======================
     UI
  ======================= */
  return (
    <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
      <h2>📝 Ghi chú theo ngày</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Nhập ghi chú…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={addNote}>➕</button>
      </div>

      {notes.length === 0 && (
        <p style={{ opacity: 0.5 }}>Chưa có ghi chú</p>
      )}

      {notes.map((n) => (
        <div
          key={n.id}
          style={{
            padding: 10,
            borderRadius: 8,
            background: "#fff",
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div>{n.text}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {n.time}
            </div>
          </div>
          <button
            onClick={() => deleteNote(n.id)}
            style={{ color: "red" }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
