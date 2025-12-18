import { cookies } from "next/headers";
import { kv } from "@vercel/kv";

/**
 * Lấy username từ session cookie
 * ❌ throw error nếu chưa đăng nhập
 */
export async function requireUsername(): Promise<string> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const username = await kv.get<string>(`session:${token}`);

  if (!username) {
    throw new Error("Unauthorized");
  }

  return username;
}
