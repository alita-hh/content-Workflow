import { NextResponse } from "next/server";

function cleanText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickKeywords(text: string): string[] {
  const words = text
    .split(/[，。；、“”‘’！!？?\s,.;:()（）【】\[\]]+/)
    .filter((w) => w.length >= 2 && w.length <= 8)
    .slice(0, 12);
  return Array.from(new Set(words)).slice(0, 6);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const articleUrl = typeof body?.articleUrl === "string" ? body.articleUrl.trim() : "";
  const bloggerName = typeof body?.bloggerName === "string" ? body.bloggerName.trim() : "";
  if (!articleUrl) {
    return NextResponse.json({ ok: false, error: "缺少文章链接" }, { status: 400 });
  }

  try {
    const response = await fetch(articleUrl, { method: "GET", cache: "no-store" });
    const html = await response.text();
    const plain = cleanText(html);
    const keywords = pickKeywords(plain);
    const keyPart = keywords.length ? keywords.join("、") : "行业趋势、数据事实、实操建议";

    const outlinePrompt = [
      `你是资深财经内容策划，请复刻公众号「${bloggerName || "目标博主"}」的选题结构。`,
      `请围绕关键词：${keyPart}，输出适配公众号的文章大纲。`,
      "大纲要求：标题、导语、3-5个一级小节、每小节要点与论据来源建议。"
    ].join("\n");

    const bodyPrompt = [
      `你是公众号主笔，请按「${bloggerName || "目标博主"}」的语气写作。`,
      "写作要求：观点明确、数据充分、段落短、结尾给出行动建议。",
      `内容主题需覆盖：${keyPart}，并保持财经领域专业性。`
    ].join("\n");

    return NextResponse.json({
      ok: true,
      outlinePrompt,
      bodyPrompt
    });
  } catch {
    return NextResponse.json({ ok: false, error: "分析失败，请更换可访问的文章链接" }, { status: 400 });
  }
}
