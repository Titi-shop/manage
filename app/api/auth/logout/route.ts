import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    await kv.del(`session:${token}`);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });

  return res;
}
