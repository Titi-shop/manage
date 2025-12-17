import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Lấy username từ session
 */
async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];

  const item = list.find((m) => m.id === id);
  if (!item) {
    return NextResponse.json({}, { status: 404 });
  }

  // ✅ REDIRECT TỚI BLOB (CÁCH CHUẨN DUY NHẤT)
  return NextResponse.redirect(item.blobUrl);
}
