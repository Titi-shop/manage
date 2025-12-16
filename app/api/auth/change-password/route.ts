import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { User } from "@/app/types";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json(
      { error: "Mật khẩu mới quá ngắn" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return NextResponse.json({}, { status: 401 });

  const username = await kv.get<string>(`session:${token}`);
  if (!username) return NextResponse.json({}, { status: 401 });

  const user = await kv.get<User>(`user:${username}`);
  if (!user || user.password !== oldPassword) {
    return NextResponse.json(
      { error: "Mật khẩu cũ không đúng" },
      { status: 403 }
    );
  }

  await kv.set(`user:${username}`, {
    ...user,
    password: newPassword,
  });

  return NextResponse.json({ ok: true });
}
