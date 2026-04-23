import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, ROLE_HOME, verifyUser } from "@/lib/auth";

const DEBUG_INGEST = "http://127.0.0.1:7561/ingest/8af16603-505f-4aed-a559-9a5e21aa1068";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const user = verifyUser(username, password);

  // #region agent log
  fetch(DEBUG_INGEST, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "14dba4" },
    body: JSON.stringify({
      sessionId: "14dba4",
      runId: "login-flow-before-fix",
      hypothesisId: "H1",
      location: "app/api/auth/login/route.ts:POST",
      message: "login_attempt",
      data: { username, success: Boolean(user), role: user?.role ?? "none" },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (!user) {
    return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    role: user.role,
    redirectTo: ROLE_HOME[user.role]
  });
  response.cookies.set(AUTH_COOKIE_NAME, user.role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
