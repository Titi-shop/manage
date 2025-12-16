import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

/**
 * Lấy username từ session
 */
async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

/**
 * Thư mục lưu file PRIVATE (KHÔNG public)
 * ⚠️ Đảm bảo thư mục này KHÔNG nằm trong /public
 */
const STORAGE_DIR = path.join(process.cwd(), "storage", "media");

export async function POST(request: NextRequest) {
  // 🔐 Kiểm tra đăng nhập
  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  // 📌 Giới hạn dung lượng (tuỳ chỉnh)
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large" },
      { status: 413 }
    );
  }

  // 📎 Phân loại file
  let type: "image" | "video" | "file" = "file";

  if (file.type.startsWith("image/")) type = "image";
  else if (file.type.startsWith("video/")) type = "video";

  // 🔐 Tạo tên file an toàn
  const ext = path.extname(file.name);
  const id = crypto.randomUUID();
  const filename = `${id}${ext}`;

  // 📁 Tách thư mục theo user
  const userDir = path.join(STORAGE_DIR, username);
  await fs.mkdir(userDir, { recursive: true });

  const filePath = path.join(userDir, filename);

  // 💾 Ghi file
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // 📦 Metadata lưu KV
  const mediaItem = {
    id,
    name: file.name,
    type,
    mime: file.type,
    size: file.size,
    path: filePath, // private path
    createdAt: Date.now(),
  };

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];
  list.unshift(mediaItem);
  await kv.set(key, list);

  return NextResponse.json(mediaItem);
}
