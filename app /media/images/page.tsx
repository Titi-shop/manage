"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImagesPage() {
  const router = useRouter();
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [list, setList] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    const res = await fetch(`/api/images?date=${date}`, {
      credentials: "include",
      cache: "no-store",
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    setList(await res.json());
  };

  useEffect(() => {
    load();
  }, [date]);

  const upload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("date", date);

    await fetch("/api/images/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    setFile(null);
    load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>📷 Ảnh theo ngày</h2>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={upload}>Upload</button>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
        }}
      >
        {list.map((img) => (
          <img
            key={img.id}
            src={img.url}
            style={{ width: "100%", borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}
