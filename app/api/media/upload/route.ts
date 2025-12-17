import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

async function getUsername() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

export async function POST(req: NextRequest) {
  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // 📌 phân loại
  let type: "image" | "video" | "file" = "file";
  if (file.type.startsWith("image/")) type = "image";
  else if (file.type.startsWith("video/")) type = "video";

  const id = crypto.randomUUID();

  // ✅ upload Blob
  const blob = await put(
    `${username}/${id}-${file.name}`,
    file,
    { access: "private" } // 🔒 private
  );

  const item = {
    id,
    name: file.name,
    type,
    mime: file.type,
    size: file.size,
    url: blob.url,        // 🔑 blob url
    createdAt: Date.now(),
  };

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];
  list.unshift(item);
  await kv.set(key, list);

  return NextResponse.json(item);
}
