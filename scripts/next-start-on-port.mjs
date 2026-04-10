#!/usr/bin/env node
/**
 * 启动前释放目标 TCP 端口上的 LISTEN 进程（macOS / Linux：lsof + SIGTERM，必要时 SIGKILL），
 * 避免旧 next 占着端口导致你始终打到旧构建。
 */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const port = process.argv[2] || process.env.PORT || "3000";
const host = process.env.HOST || "127.0.0.1";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** @returns {number[]} */
function listenerPids(p) {
  if (process.platform === "win32") return [];
  try {
    const out = execSync(`lsof -nP -iTCP:${p} -sTCP:LISTEN -t`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    if (!out) return [];
    return [...new Set(out.split(/\s+/).filter(Boolean).map(Number))].filter(
      (n) => Number.isFinite(n) && n !== process.pid
    );
  } catch {
    return [];
  }
}

async function freePort(p) {
  if (process.platform === "win32") {
    console.warn(
      "[next-start-on-port] Windows：请手动结束占用端口 %s 的进程后再启动。",
      p
    );
    return;
  }
  let pids = listenerPids(p);
  if (pids.length === 0) return;
  for (const n of pids) {
    try {
      process.kill(n, "SIGTERM");
      console.warn("[next-start-on-port] SIGTERM → PID", n, "port", p);
    } catch {
      /* ignore */
    }
  }
  await sleep(900);
  pids = listenerPids(p);
  for (const n of pids) {
    try {
      process.kill(n, "SIGKILL");
      console.warn("[next-start-on-port] SIGKILL → PID", n, "port", p);
    } catch {
      /* ignore */
    }
  }
  await sleep(300);
}

async function main() {
  await freePort(port);

  const bidPath = path.join(process.cwd(), ".next", "BUILD_ID");
  let bid = "(无 .next/BUILD_ID，请先 npm run build)";
  try {
    bid = fs.readFileSync(bidPath, "utf8").trim();
  } catch {
    /* keep default */
  }
  console.log("\n========== Next 生产预览 ==========");
  console.log("[next-start-on-port] 当前目录:", process.cwd());
  console.log("[next-start-on-port] BUILD_ID:", bid);
  console.log(
    "[next-start-on-port] 就绪后请在浏览器打开 →",
    `http://${host}:${port}/radar`
  );
  console.log(
    "[next-start-on-port] 重要：本窗口必须一直保持打开；关掉终端 = 服务停止 = 浏览器会「拒绝连接」。\n"
  );

  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const child = spawn(
    cmd,
    ["next", "start", "--hostname", host, "--port", String(port)],
    { stdio: "inherit", shell: process.platform === "win32" }
  );
  child.on("exit", (code) => process.exit(code ?? 1));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
