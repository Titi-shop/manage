"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/media", {
          credentials: "include",
          cache: "no-store",
        });

        // ⚠️ CHƯA ĐĂNG NHẬP → KHÔNG LỖI, KHÔNG HIỂN THỊ GÌ
        if (res.status === 401) {
          setImages([]);
          return;
        }

        if (!res.ok) {
          // các lỗi khác cũng không cần hiện ra UI
          setImages([]);
          return;
        }

        const data: MediaItem[] = await res.json();

        // 👉 Chỉ lấy HÌNH ẢNH
        const imgs = data.filter((m) => m.type === "image");
        setImages(imgs);
      } catch {
        // ❌ Không hiện lỗi
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="p-4">Đang tải hình ảnh...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">📷 Hình ảnh</h1>

      {images.length === 0 ? (
        <div className="text-gray-500">
          Chưa có hình ảnh
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border rounded overflow-hidden bg-gray-50"
            >
              {/* Ảnh PRIVATE – chỉ load khi đã đăng nhập */}
              <img
                src={`/api/media/${img.id}`}
                alt={img.name}
                className="w-full h-40 object-cover"
              />

              <div className="p-2 text-xs truncate">{img.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
