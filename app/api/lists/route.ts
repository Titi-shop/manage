import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { List } from "@/app/types";

interface CreateListBody {
  name: string;
}

// =======================
// GET /api/lists
// =======================
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json([], { status: 401 });
  }

  const username = await kv.get<string>(`session:${token}`);
  if (!username) {
    return NextResponse.json([], { status: 401 });
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  return NextResponse.json(lists);
}

// =======================
// POST /api/lists
// =======================
export async function POST(req: Request) {
  const body: CreateListBody = await req.json();

  if (!body.name || !body.name.trim()) {
    return NextResponse.json(
      { error: "Thiếu tên sổ" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = await kv.get<string>(`session:${token}`);
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];

  const newList: List = {
    id: Date.now().toString(),
    name: body.name,
    items: [],
  } as List; // ✅ tránh lỗi type khi List cũ còn field dư

  lists.unshift(newList);
  await kv.set(`lists:${username}`, lists);

  return NextResponse.json(newList);
}
