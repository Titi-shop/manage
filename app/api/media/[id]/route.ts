import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

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

  // Đọc file private từ disk
  const filePath = item.path;
  const buffer = await fs.readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": item.mime || "application/octet-stream",
      "Content-Length": buffer.length.toString(),
      // ⬇️ inline để xem ảnh / video trực tiếp
      "Content-Disposition": `inline; filename="${encodeURIComponent(
        item.name
      )}"`,
    },
  });
}
