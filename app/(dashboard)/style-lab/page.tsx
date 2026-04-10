"use client";

import { useState } from "react";
import { styleLabWechatMock, styleLabXhsMock } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

type StyleType = "xhs" | "wechat" | "";

export default function StyleLabPage() {
  const [styleType, setStyleType] = useState<StyleType>("");
  const [articleUrl, setArticleUrl] = useState("https://mp.weixin.qq.com/s/ze-ping-macro-article");
  const [xhsImagePrompt, setXhsImagePrompt] = useState("");
  const [xhsContentPrompt, setXhsContentPrompt] = useState("");
  const [wechatTitlePrompt, setWechatTitlePrompt] = useState("");
  const [wechatOutlinePrompt, setWechatOutlinePrompt] = useState("");
  const [wechatBodyPrompt, setWechatBodyPrompt] = useState("");

  const canParse = Boolean(styleType) && Boolean(articleUrl.trim());

  const handleParse = () => {
    if (styleType === "xhs") {
      setXhsImagePrompt(styleLabXhsMock.imagePrompt);
      setXhsContentPrompt(styleLabXhsMock.contentPrompt);
      return;
    }
    if (styleType === "wechat") {
      setWechatTitlePrompt(styleLabWechatMock.titlePrompt);
      setWechatOutlinePrompt(styleLabWechatMock.outlinePrompt);
      setWechatBodyPrompt(styleLabWechatMock.bodyPrompt);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Style Intelligence"
        title="财经风格克隆实验室"
        description="先选择目标平台，再解析提炼对应的 Prompt 结构。"
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
          <h3 className="text-base font-semibold text-textMain">提炼操作区</h3>
          <p className="mt-1 text-sm text-textMuted">需先选风格类型，才可解析提炼 Prompt。</p>

          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-textMain">生成风格选择</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStyleType("xhs")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    styleType === "xhs" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
                  }`}
                >
                  小红书风格
                </button>
                <button
                  type="button"
                  onClick={() => setStyleType("wechat")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    styleType === "wechat" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
                  }`}
                >
                  公众号风格
                </button>
              </div>
            </div>

            <input
              value={articleUrl}
              onChange={(event) => setArticleUrl(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-textMain outline-none ring-accent/20 transition focus:ring-4"
            />
            <button
              type="button"
              disabled={!canParse}
              onClick={handleParse}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                canParse
                  ? "border-accent/50 bg-accent text-white hover:bg-[#1e6fe0]"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              解析爆款基因与提取 Prompt
            </button>
            {!styleType ? (
              <p className="text-xs text-amber-600">请先选择“小红书风格”或“公众号风格”。</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
          <h3 className="text-base font-semibold text-textMain">微调沙盒区（Code Editor）</h3>
          <p className="mt-1 text-sm text-textMuted">按平台输出不同字段，可继续人工编辑。</p>

          {styleType === "xhs" ? (
            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium text-textMain">图片风格 Prompt（小红书）</p>
                <textarea
                  value={xhsImagePrompt}
                  onChange={(event) => setXhsImagePrompt(event.target.value)}
                  className="h-28 w-full rounded-lg border border-slate-200 bg-[#f8fafc] p-4 font-mono text-sm leading-6 text-slate-700 outline-none ring-accent/20 transition focus:ring-4"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-textMain">内容风格 Prompt（小红书）</p>
                <textarea
                  value={xhsContentPrompt}
                  onChange={(event) => setXhsContentPrompt(event.target.value)}
                  className="h-32 w-full rounded-lg border border-slate-200 bg-[#f8fafc] p-4 font-mono text-sm leading-6 text-slate-700 outline-none ring-accent/20 transition focus:ring-4"
                />
              </div>
            </div>
          ) : styleType === "wechat" ? (
            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium text-textMain">标题 Prompt（公众号）</p>
                <textarea
                  value={wechatTitlePrompt}
                  onChange={(event) => setWechatTitlePrompt(event.target.value)}
                  className="h-24 w-full rounded-lg border border-slate-200 bg-[#f8fafc] p-4 font-mono text-sm leading-6 text-slate-700 outline-none ring-accent/20 transition focus:ring-4"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-textMain">内容框架 Prompt（公众号）</p>
                <textarea
                  value={wechatOutlinePrompt}
                  onChange={(event) => setWechatOutlinePrompt(event.target.value)}
                  className="h-28 w-full rounded-lg border border-slate-200 bg-[#f8fafc] p-4 font-mono text-sm leading-6 text-slate-700 outline-none ring-accent/20 transition focus:ring-4"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-textMain">内容正文 Prompt（公众号）</p>
                <textarea
                  value={wechatBodyPrompt}
                  onChange={(event) => setWechatBodyPrompt(event.target.value)}
                  className="h-32 w-full rounded-lg border border-slate-200 bg-[#f8fafc] p-4 font-mono text-sm leading-6 text-slate-700 outline-none ring-accent/20 transition focus:ring-4"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-textMuted">
              请先在左侧选择平台风格并点击“解析爆款基因与提取 Prompt”。
            </div>
          )}

          <button
            type="button"
            className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            存入风格基因库
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
        <h3 className="text-base font-semibold text-textMain">风格基因管理后台已独立</h3>
        <p className="mt-1 text-sm text-textMuted">
          管理表格已迁移到独立页面“风格基因管理后台”，并按小红书 / 公众号双 Tab 管理。
        </p>
      </div>
    </section>
  );
}
