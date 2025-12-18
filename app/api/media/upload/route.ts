import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { put } from "@vercel/blob";

async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  return await kv.get<string>(`session:${token}`);
}

export async function POST(req: NextRequest) {
  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();

  // ✅ Vercel Blob CHỈ public
  const blob = await put(
    `media/${username}/${id}-${file.name}`,
    file,
    { access: "public" }
  );

  const mediaItem = {
    id,
    name: file.name,
    type: file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "file",
    mime: file.type,
    size: file.size,
    url: blob.url, // ⚠️ KHÔNG expose trực tiếp ra UI
    createdAt: Date.now(),
  };

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];
  list.unshift(mediaItem);
  await kv.set(key, list);

  return NextResponse.json(mediaItem);
}
