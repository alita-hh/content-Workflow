import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "财经内容工作流",
  description: "面向运营团队的金融科技内容生产后台"
};

function readAppBuildId(): string {
  try {
    const p = path.join(process.cwd(), ".next", "BUILD_ID");
    return fs.readFileSync(p, "utf8").trim();
  } catch {
    return "unknown";
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appBuildId = readAppBuildId();
  return (
    <html lang="zh-CN" data-app-build-id={appBuildId}>
      <body>{children}</body>
    </html>
  );
}
