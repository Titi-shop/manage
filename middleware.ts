import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;

  // ===== PUBLIC ROUTES =====
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // ===== CHƯA LOGIN → ÉP LOGIN =====
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * ✅ QUAN TRỌNG:
 * chỉ áp middleware cho route cần bảo vệ
 */
export const config = {
  matcher: [
    "/", 
    "/list/:path*",
    "/change-password",
  ],
};
