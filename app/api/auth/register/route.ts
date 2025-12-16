import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const userKey = `user:${username}`;
  const exists = await kv.get(userKey);

  if (exists) {
    return NextResponse.json({ error: "User tồn tại" }, { status: 400 });
  }

  await kv.set(userKey, { username, password });
  await kv.set(`lists:${username}`, []);

  return NextResponse.json({ ok: true });
}
