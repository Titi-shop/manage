import { cookies } from "next/headers";
import { kv } from "@vercel/kv";

/**
 * Bắt buộc phải đăng nhập
 * → trả về username
 * → throw nếu chưa đăng nhập
 */
export async function requireUsername(): Promise<string> {
  // ✅ BẮT BUỘC await (Next.js 15+)
  const cookieStore = await cookies();

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
