import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE)?.value;

  if (!(await isValidSession(session))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
