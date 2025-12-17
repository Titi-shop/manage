"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  mime: string;
  size: number;
  createdAt: number;
};

export default function ImagesPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  /* =======================
     LOAD IMAGES
  ======================= */
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media", {
        credentials: "include",
        cache: "no-store",
      });

      // ⛔ chưa đăng nhập → coi như không có ảnh
      if (res.status === 401) {
        setImages([]);
        return;
      }

      if (!res.ok) {
        setImages([]);
        return;
      }

      const data: MediaItem[] = await res.json();

      // chỉ lấy ảnh
      setImages(data.filter((m) => m.type === "image"));
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* =======================
     UPLOAD IMAGE
  ======================= */
  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/media/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    // chỉ reload nếu upload thành công
    if (res.ok) {
      await fetchImages();
    }
  };

  /* =======================
     UI
  ======================= */
  if (loading) {
    return <div style={{ padding: 16 }}>Đang tải hình ảnh…</div>;
  }

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>📷 Hình ảnh</h1>

        {/* nút + nhỏ */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#1f3c88",
            color: "white",
            border: "none",
            fontSize: 20,
          }}
          title="Tải ảnh lên"
        >
          +
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadImage(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* CONTENT */}
      {images.length === 0 ? (
        <div style={{ opacity: 0.5 }}>Chưa có hình ảnh</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
          }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fafafa",
              }}
            >
              {/* ẢNH PRIVATE */}
              <img
                src={`/api/media/${img.id}`}
                alt={img.name}
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  padding: 6,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {img.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
