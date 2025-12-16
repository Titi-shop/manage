"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  mime: string;
  size: number;
  path?: string;      // backend dùng
  createdAt: number;
};

export default function ImagesPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/media", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const data: MediaItem[] = await res.json();

        // 👉 Chỉ lấy HÌNH ẢNH
        const imgs = data.filter((m) => m.type === "image");
        setImages(imgs);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="p-4">Đang tải hình ảnh...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">📷 Hình ảnh</h1>

      {images.length === 0 ? (
        <div className="text-gray-500">Chưa có hình ảnh</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border rounded overflow-hidden bg-gray-50"
            >
              {/* 
                ⚠️ Ảnh PRIVATE
                → sau này nên load qua /api/media/[id]
                → hiện tại có thể dùng blob/url nếu bạn đã viết GET
              */}
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
