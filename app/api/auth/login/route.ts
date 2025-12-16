import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/app/types";

export async function POST(req: Request) {
  const { username, password }: { username: string; password: string } =
    await req.json();

  const user = await kv.get<User>(`user:${username}`);
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Sai thông tin đăng nhập" },
      { status: 401 }
    );
  }

  const token = crypto.randomUUID();

  // lưu session 1 ngày
  await kv.set(`session:${token}`, username, { ex: 60 * 60 * 24 });

  const res = NextResponse.json({ ok: true });

  // ✅ RẤT QUAN TRỌNG
  res.cookies.set("session", token, {
    httpOnly: true,
    path: "/",          // 🔥 BẮT BUỘC
    sameSite: "lax",    // 🔥 BẮT BUỘC
  });

  return res;
}
