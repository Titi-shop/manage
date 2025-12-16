"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  text: string;
  time: string;
}

export default function CalendarNotePage() {
  const router = useRouter();

  /* =======================
     TIME (REAL CLOCK)
  ======================= */
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  /* =======================
     VIEW DATE (ANY DAY)
  ======================= */
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // key lưu ghi chú theo ngày đang xem
  const dateKey = viewDate.toISOString().slice(0, 10);

  /* =======================
     NOTES
  ======================= */
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`notes-${dateKey}`);
    setNotes(saved ? JSON.parse(saved) : []);
  }, [dateKey]);

  useEffect(() => {
    localStorage.setItem(`notes-${dateKey}`, JSON.stringify(notes));
  }, [notes, dateKey]);

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

  const day = viewDate.getDate();
  const month = viewDate.getMonth() + 1;
  const year = viewDate.getFullYear();
  const weekday = weekdays[viewDate.getDay()];

  const timeNow = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* =======================
     CHANGE DAY
  ======================= */
  const changeDay = (delta: number) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + delta);
    setViewDate(d);
  };

  const onPickDate = (value: string) => {
    setViewDate(new Date(value));
  };

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
      {/* TOP ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => router.push("/login")}
          style={{ fontSize: 13 }}
        >
          🔐 Đăng nhập
        </button>

        <button
          onClick={() => router.push("/register")}
          style={{ fontSize: 13 }}
        >
          ✍️ Đăng ký
        </button>
      </div>

      {/* HEADER DATE */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 20,
            background: "#fff",
            fontSize: 14,
            marginBottom: 8,
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

        <div style={{ fontSize: 20 }}>{weekday}</div>

        <div style={{ fontSize: 13, opacity: 0.7 }}>
          ⏰ Giờ hiện tại: {timeNow}
        </div>
      </div>

      {/* DATE NAV */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button onClick={() => changeDay(-1)}>⬅️</button>

        <input
          type="date"
          value={dateKey}
          onChange={(e) => onPickDate(e.target.value)}
        />

        <button onClick={() => changeDay(1)}>➡️</button>
      </div>

      {/* ADD NOTE */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Ghi chú cho ngày này…"
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

      {/* NOTES */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.length === 0 && (
          <div style={{ opacity: 0.5, textAlign: "center" }}>
            Không có ghi chú cho ngày này
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
