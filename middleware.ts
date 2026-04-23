import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, ROLE_HOME, canAccessPath, normalizeRole } from "@/lib/auth";

const DEBUG_INGEST = "http://127.0.0.1:7561/ingest/8af16603-505f-4aed-a559-9a5e21aa1068";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = normalizeRole(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const isLoginPath = pathname === "/login";
  const isPublicAsset = pathname.startsWith("/_next") || pathname.includes(".");

  if (isPublicAsset) return NextResponse.next();

  // #region agent log
  fetch(DEBUG_INGEST, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "14dba4" },
    body: JSON.stringify({
      sessionId: "14dba4",
      runId: "login-flow-before-fix",
      hypothesisId: "H3",
      location: "middleware.ts:middleware",
      message: "route_guard_evaluated",
      data: { pathname, role: role ?? "none", isLoginPath },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (!role) {
    if (isLoginPath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPath) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth/login|api/auth/logout).*)"]
};
