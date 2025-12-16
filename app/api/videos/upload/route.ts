import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  // ⚠️ Giới hạn dung lượng video (ví dụ 50MB)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "Video quá lớn" }, { status: 400 });
  }

  // ☁️ Upload lên Vercel Blob
  const blob = await put(
    `videos/${Date.now()}-${file.name}`,
    file,
    { access: "public" }
  );

  return NextResponse.json({
    url: blob.url,
    name: file.name,
  });
}
