import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json([], { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "video"
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!type || !date) return NextResponse.json([]);

  const key = `media:${username}:${type}:${date}`;
  const list = (await kv.get(key)) ?? [];

  return NextResponse.json(list);
}
