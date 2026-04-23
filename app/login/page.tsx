"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const DEBUG_INGEST = "http://127.0.0.1:7561/ingest/8af16603-505f-4aed-a559-9a5e21aa1068";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      // #region agent log
      fetch(DEBUG_INGEST, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "14dba4" },
        body: JSON.stringify({
          sessionId: "14dba4",
          runId: "login-flow-before-fix",
          hypothesisId: "H2",
          location: "app/login/page.tsx:onSubmit",
          message: "login_form_submitted",
          data: { usernameLength: username.length, hasPassword: password.length > 0 },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "登录失败，请重试");
        return;
      }
      router.replace(data.redirectTo ?? "/");
      router.refresh();
    } catch {
      setError("网络异常，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <h1 className="text-2xl font-semibold text-textMain">账号登录</h1>
        <p className="mt-2 text-sm text-textMuted">支持两套账号体系：产品研发、运营</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-textMain">账号</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
              placeholder="product 或 ops"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-textMain">密码</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
              placeholder="请输入密码"
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </section>
    </main>
  );
}
