import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

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
  { params }: { params: { id: string } } // ✅ ĐÚNG
) {
  const { id } = params; // ✅ KHÔNG await

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

  // 🔥 LẤY FILE TỪ VERCEL BLOB
  const blob = await get(item.blobUrl);

  return new NextResponse(blob.body, {
    headers: {
      "Content-Type": item.mime,
      "Content-Disposition": `inline; filename="${encodeURIComponent(
        item.name
      )}"`,
    },
  });
}
