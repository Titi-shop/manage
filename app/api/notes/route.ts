import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

/* =======================
   GET NOTES
   /api/notes?date=YYYY-MM-DD
======================= */
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const key = `notes:${username}:${date}`;
  const notes = (await kv.get(key)) ?? [];

  return NextResponse.json(notes);
}

/* =======================
   SAVE NOTES
======================= */
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { date, notes } = body;

  if (!date || !Array.isArray(notes)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const key = `notes:${username}:${date}`;
  await kv.set(key, notes);

  return NextResponse.json({ ok: true });
}
