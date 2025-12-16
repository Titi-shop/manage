import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  // 🔐 AUTH
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 📥 FORM
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const type = form.get("type") as "image" | "video" | null;
  const date = form.get("date") as string | null;

  if (!file || !type || !date) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // ⛔ Giới hạn dung lượng
  const maxSize = type === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File quá lớn" }, { status: 400 });
  }

  // ☁️ Upload Blob
  const blob = await put(
    `${username}/${type}/${Date.now()}-${file.name}`,
    file,
    { access: "public" }
  );

  // 🧠 Lưu metadata KV
  const key = `media:${username}:${type}:${date}`;
  const list = ((await kv.get(key)) as any[]) ?? [];

  const item = {
    id: crypto.randomUUID(),
    url: blob.url,
    name: file.name,
    createdAt: Date.now(),
  };

  await kv.set(key, [item, ...list]);

  return NextResponse.json(item);
}
