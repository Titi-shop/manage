"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [now, setNow] = useState(new Date());

  // cập nhật giờ mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  const weekday = weekdays[now.getDay()];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        textAlign: "center",
        background:
          "linear-gradient(to bottom, #f6f2e8, #e9efd9)",
      }}
    >
      {/* Tháng / Năm */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: 20,
          background: "#fff",
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        Tháng {month} – {year}
      </div>

      {/* Ngày lớn */}
      <div
        style={{
          fontSize: 120,
          fontWeight: "bold",
          color: "#1f3c88",
          lineHeight: 1,
        }}
      >
        {day}
      </div>

      {/* Thứ */}
      <div
        style={{
          fontSize: 22,
          letterSpacing: 1,
          marginBottom: 24,
        }}
      >
        {weekday}
      </div>

      {/* Thông tin dưới */}
      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "space-around",
          fontSize: 16,
        }}
      >
        <div>
          <div style={{ opacity: 0.6 }}>GIỜ</div>
          <strong>
            {hours}:{minutes}
          </strong>
        </div>

        <div>
          <div style={{ opacity: 0.6 }}>NGÀY</div>
          <strong>{day}</strong>
        </div>

        <div>
          <div style={{ opacity: 0.6 }}>THÁNG</div>
          <strong>{month}</strong>
        </div>

        <div>
          <div style={{ opacity: 0.6 }}>NĂM</div>
          <strong>{year}</strong>
        </div>
      </div>
    </div>
  );
}
