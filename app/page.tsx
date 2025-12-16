"use client";

import { useEffect, useState } from "react";

interface Note {
  id: number;
  text: string;
  time: string;
}

export default function CalendarNotePage() {
  const [now, setNow] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");

  /* =======================
     TIME – REAL CLOCK
  ======================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  /* =======================
     LOAD NOTES BY DATE
  ======================= */
  const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    const saved = localStorage.getItem(`notes-${dateKey}`);
    setNotes(saved ? JSON.parse(saved) : []);
  }, [dateKey]);

  /* =======================
     SAVE NOTES
  ======================= */
  useEffect(() => {
    localStorage.setItem(`notes-${dateKey}`, JSON.stringify(notes));
  }, [notes, dateKey]);

  /* =======================
     ADD NOTE
  ======================= */
  const addNote = () => {
    if (!input.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      text: input,
      time: now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setNotes([newNote, ...notes]);
    setInput("");
  };

  /* =======================
     DELETE NOTE
  ======================= */
  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  /* =======================
     DATE FORMAT
  ======================= */
  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const weekday = weekdays[now.getDay()];
  const time = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* =======================
     UI
  ======================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 16,
        background:
          "linear-gradient(180deg, #f6f8fc 0%, #eef2e6 100%)",
      }}
    >
      {/* HEADER DATE */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 20,
            background: "#fff",
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          Tháng {month} – {year}
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: "bold",
            color: "#1f3c88",
            lineHeight: 1,
          }}
        >
          {day}
        </div>

        <div style={{ fontSize: 20, marginBottom: 6 }}>
          {weekday}
        </div>

        <div style={{ fontSize: 14, opacity: 0.7 }}>
          ⏰ {time}
        </div>
      </div>

      {/* ADD NOTE */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input
          placeholder="Ghi chú cho hôm nay…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addNote}
          style={{
            padding: "0 14px",
            borderRadius: 10,
            background: "#1f3c88",
            color: "white",
            border: "none",
          }}
        >
          ＋
        </button>
      </div>

      {/* NOTES LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.length === 0 && (
          <div style={{ opacity: 0.5, textAlign: "center" }}>
            Chưa có ghi chú cho hôm nay
          </div>
        )}

        {notes.map((n) => (
          <div
            key={n.id}
            style={{
              background: "#fff",
              padding: 12,
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              style={{
                border: "none",
                background: "transparent",
                color: "red",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
