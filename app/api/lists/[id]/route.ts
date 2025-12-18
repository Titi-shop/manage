import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { List } from "@/app/types";
import { requireUsername } from "@/app/api/_utils/session";

/* =======================
   GET /api/lists/[id]
   Lấy 1 sổ
======================= */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const username = await requireUsername();

    const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
    const list = lists.find((l) => l.id === id);

    if (!list) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/* =======================
   POST /api/lists/[id]
   Lưu sổ
======================= */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const username = await requireUsername();

    const rows = await req.json();
    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
    const index = lists.findIndex((l) => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    lists[index] = {
      ...lists[index],
      items: rows,
    };

    await kv.set(`lists:${username}`, lists);

    return NextResponse.json(lists[index]);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/* =======================
   DELETE /api/lists/[id]
   Xoá sổ (bắt buộc mật khẩu)
======================= */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const username = await requireUsername();

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    // 🔐 MẬT KHẨU XÁC NHẬN XOÁ
    if (password !== "1234") {
      return NextResponse.json(
        { error: "Sai mật khẩu" },
        { status: 403 }
      );
    }

    const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
    const exists = lists.some((l) => l.id === id);

    if (!exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const filtered = lists.filter((l) => l.id !== id);
    await kv.set(`lists:${username}`, filtered);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
