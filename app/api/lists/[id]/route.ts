import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { List } from "@/app/types";

async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

// =======================
// GET /api/lists/[id]
// =======================
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ BẮT BUỘC await

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  const list = lists.find((l) => l.id === id);

  return NextResponse.json(list ?? {}, {
    status: list ? 200 : 404,
  });
}

// =======================
// POST /api/lists/[id]
// =======================
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ BẮT BUỘC await

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const rows = await request.json(); // 👈 lưu toàn bộ bảng

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  const index = lists.findIndex((l) => l.id === id);

  if (index === -1) {
    return NextResponse.json({}, { status: 404 });
  }

  lists[index] = {
    ...lists[index],
    items: rows,
  };

  await kv.set(`lists:${username}`, lists);

  return NextResponse.json(lists[index]);
                                  }
