import { NextResponse } from "next/server";

function extractMeta(content: string, key: string) {
  const reg = new RegExp(`<meta[^>]+${key}=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const match = content.match(reg);
  return match?.[2] ?? "";
}

function extractTitle(content: string) {
  const ogTitle = extractMeta(content, "property");
  if (ogTitle) return ogTitle;
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch?.[1]?.trim() ?? "";
}

function extractImage(content: string) {
  const ogImage = content.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  return ogImage?.[1] ?? "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const articleUrl = typeof body?.articleUrl === "string" ? body.articleUrl.trim() : "";
  if (!articleUrl) {
    return NextResponse.json({ ok: false, error: "请输入公众号文章链接" }, { status: 400 });
  }

  try {
    const urlObj = new URL(articleUrl);
    const response = await fetch(urlObj.toString(), { method: "GET", cache: "no-store" });
    const html = await response.text();
    const bloggerName = extractTitle(html) || "未识别公众号";
    const avatar =
      extractImage(html) ||
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(urlObj.hostname)}&sz=128`;
    return NextResponse.json({ ok: true, bloggerName, avatar });
  } catch {
    return NextResponse.json({ ok: false, error: "链接解析失败，请检查链接是否可访问" }, { status: 400 });
  }
}
