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
  const date = searchParams.get("date");

  if (!date) return NextResponse.json([]);

  const key = `images:${username}:${date}`;
  const list = (await kv.get(key)) ?? [];

  return NextResponse.json(list);
}
