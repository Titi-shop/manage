import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { List, User } from "@/app/types";

export async function POST(req: Request) {
  const { ids, password }: { ids: string[]; password: string } = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({}, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({}, { status: 401 });

  const user = await kv.get<User>(`user:${username}`);
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Sai mật khẩu" },
      { status: 403 }
    );
  }

  const lists = (await kv.get<List[]>(`lists:${username}`)) ?? [];
  const filtered = lists.filter(l => !ids.includes(l.id));

  await kv.set(`lists:${username}`, filtered);

  return NextResponse.json({ ok: true });
                                  }
