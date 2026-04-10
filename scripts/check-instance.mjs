#!/usr/bin/env node
/**
 * 自检当前端口上的 next start 是否为「本仓库最新 build」：
 * - data-app-build-id 缺失 ≈ 旧构建或未包含当前 layout 改动
 * - POST /api/debug-log 404 ≈ 探针无法写 .cursor/debug-710836.log
 */
const port = process.env.PORT || "3000";
const base = `http://127.0.0.1:${port}`;

async function main() {
  const radar = await fetch(`${base}/radar`);
  const html = await radar.text();
  const dataAttr = html.match(/data-app-build-id="([^"]+)"/);
  const comment = html.match(/<!DOCTYPE html><!--([^>]+)-->/);

  console.log(`[check-instance] GET ${base}/radar → HTTP ${radar.status}`);
  console.log(
    `[check-instance] HTML comment id: ${comment ? comment[1] : "(none)"}`
  );
  console.log(
    `[check-instance] data-app-build-id: ${dataAttr ? dataAttr[1] : "MISSING — 多为旧进程或未重新 build"}`
  );

  const post = await fetch(`${base}/api/debug-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "710836",
      hypothesisId: "doctor",
      location: "scripts/check-instance.mjs",
      message: "cli_probe",
      data: { port: Number(port) }
    })
  });
  const body = await post.text();
  const bodyShort =
    post.status === 200 ? body : `${body.slice(0, 120)}${body.length > 120 ? "…" : ""}`;
  console.log(
    `[check-instance] POST ${base}/api/debug-log → HTTP ${post.status} ${bodyShort}`
  );

  if (post.status !== 200) {
    console.error(
      "\n[check-instance] 建议：① 在本目录执行 `npm run preview`（构建后在 3847 端口启动，避开 3000 上的僵尸进程），浏览器打开 http://127.0.0.1:3847/radar ；② 再执行 `PORT=3847 npm run check:instance` 应看到 POST 200。\n"
    );
    console.error(
      "[check-instance] 若必须用 3000：先 `npm run build` 再 `npm run start:3000`（会先 TERM/KILL 占用该端口的监听进程）。\n"
    );
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[check-instance] 请求失败（服务未启动或端口错误？）", e);
  process.exitCode = 1;
});
