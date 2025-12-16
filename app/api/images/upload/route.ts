import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  /* ===== AUTH ===== */
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  /* ===== FORM DATA ===== */
  const form = await req.formData();
  const file = form.get("file") as File;
  const date = form.get("date") as string; // YYYY-MM-DD

  if (!file || !date) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  /* ===== UPLOAD TO BLOB ===== */
  const blob = await put(
    `${username}/images/${Date.now()}-${file.name}`,
    file,
    { access: "public" }
  );

  /* ===== SAVE METADATA TO KV ===== */
  const key = `images:${username}:${date}`;
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
