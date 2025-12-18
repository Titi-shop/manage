import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";

async function getUsername(): Promise<string | null> {
  // ✅ BẮT BUỘC await
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  return await kv.get<string>(`session:${token}`);
}

export async function GET() {
  const username = await getUsername();
  if (!username) {
    return NextResponse.json([], { status: 401 });
  }

  const key = `media:${username}`;
  const list = (await kv.get<any[]>(key)) ?? [];

  return NextResponse.json(list);
}
