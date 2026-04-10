import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "财经内容工作流",
  description: "面向运营团队的金融科技内容生产后台"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
