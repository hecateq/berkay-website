import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./src/auth";

export default auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const isOnAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isOnAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    const role = (req.auth?.user as any)?.role;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
