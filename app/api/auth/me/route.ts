import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({}, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({}, { status: 401 });

  return NextResponse.json({ username });
}
