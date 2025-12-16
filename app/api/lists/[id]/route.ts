import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { List } from "@/app/types";

/**
 * Lấy username từ session cookie
 */
async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return await kv.get<string>(`session:${token}`);
}

// =======================
// GET /api/lists/[id]
// Lấy 1 list theo id
// =======================
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  const list = lists.find((l) => l.id === id);

  if (!list) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(list);
}

// =======================
// PUT /api/lists/[id]
// Cập nhật nội dung list
// =======================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const rows = await request.json(); // nội dung bảng

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

// =======================
// DELETE /api/lists/[id]
// Xoá list
// =======================
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const username = await getUsername();
  if (!username) {
    return NextResponse.json({}, { status: 401 });
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  const newLists = lists.filter((l) => l.id !== id);

  if (newLists.length === lists.length) {
    return NextResponse.json({}, { status: 404 });
  }

  await kv.set(`lists:${username}`, newLists);

  return NextResponse.json({ success: true });
}
