import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleHome: Record<string, string> = {
  PATIENT: "/patient",
  DOCTOR: "/arzt",
  NURSE: "/arzt",
  ADMIN: "/admin",
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;

  const isLandingOrAuth = nextUrl.pathname === "/login" || nextUrl.pathname === "/";

  if (!isLoggedIn && !isLandingOrAuth) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isLandingOrAuth) {
    return NextResponse.redirect(new URL(roleHome[role ?? ""] ?? "/", nextUrl));
  }

  if (isLoggedIn && role) {
    const protectedPrefixes: Record<string, string> = {
      "/patient": "PATIENT",
      "/arzt": "DOCTOR_NURSE",
      "/admin": "ADMIN",
    };
    for (const [prefix, requiredRole] of Object.entries(protectedPrefixes)) {
      if (nextUrl.pathname.startsWith(prefix)) {
        const allowed =
          requiredRole === "DOCTOR_NURSE" ? role === "DOCTOR" || role === "NURSE" : role === requiredRole;
        if (!allowed) {
          return NextResponse.redirect(new URL(roleHome[role] ?? "/", nextUrl));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
