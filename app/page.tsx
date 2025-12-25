"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeCalendarPage() {
  const router = useRouter();

  /* =======================
     REAL TIME CLOCK
  ======================= */
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  /* =======================
     VIEW DATE
  ======================= */
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const dateKey = viewDate.toISOString().slice(0, 10);

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
        position: "relative",
      }}
    >
      {/* 🔐 LOGIN HOTSPOT (ẨN) */}
      <div
        onClick={() => router.push("/login")}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          cursor: "pointer",
          background: "transparent",
          zIndex: 9999,
        }}
      />

      {/* ===== HEADER DATE ===== */}
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

      {/* ===== DATE NAV ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 20,
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

      {/* ===== GO TO NOTES ===== */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => router.push("/notes")}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            background: "#1f3c88",
            color: "white",
            border: "none",
            fontSize: 14,
          }}
        >
          📝 Xem / ghi chú cho ngày này
        </button>
      </div>
    </div>
  );
}
