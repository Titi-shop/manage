import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getUsername() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];

  const item = list.find((m) => m.id === params.id);
  if (!item) {
    return NextResponse.json({}, { status: 404 });
  }

  // ✅ redirect tới Blob (không lộ user khác)
  return NextResponse.redirect(item.url);
}
