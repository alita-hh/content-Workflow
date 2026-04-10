"use client";

import { useEffect, useMemo, useState } from "react";
import { MATRIX_TOPIC_STORAGE_KEY, matrixSelectedHotspot, styleGenes } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

type SelectedTopic = {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
};

const PLATFORM = "公众号" as const;

function getWechatStyleNames() {
  return styleGenes.filter((item) => item.platform === PLATFORM).map((item) => item.bloggerName);
}

export default function MatrixGenPage() {
  const styleOptions = useMemo(() => getWechatStyleNames(), []);

  const [selectedStyle, setSelectedStyle] = useState(() => getWechatStyleNames()[0] ?? "");
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic | null>(null);

  const [outline, setOutline] = useState("");
  const [outlineEdit, setOutlineEdit] = useState("");
  const [content, setContent] = useState("");
  const [contentEdit, setContentEdit] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const rawTopic = window.localStorage.getItem(MATRIX_TOPIC_STORAGE_KEY);
    if (!rawTopic) return;
    try {
      const parsedTopic = JSON.parse(rawTopic) as SelectedTopic;
      setSelectedTopic(parsedTopic);
    } catch {
      window.localStorage.removeItem(MATRIX_TOPIC_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (styleOptions.length > 0 && !styleOptions.includes(selectedStyle)) {
      setSelectedStyle(styleOptions[0]!);
    }
  }, [styleOptions, selectedStyle]);

  useEffect(() => {
    setOutline("");
    setOutlineEdit("");
    setContent("");
    setContentEdit("");
    setTitle("");
  }, [selectedStyle]);

  const selectedGene = styleGenes.find(
    (item) => item.bloggerName === selectedStyle && item.platform === PLATFORM
  );
  const topicTitle = selectedTopic?.title ?? matrixSelectedHotspot;

  const generateOutline = () => {
    const base =
      selectedGene?.wechatOutlinePrompt ??
      "框架：1) 热点背景；2) 市场影响；3) 配置建议；4) 风险提示。";
    setOutline(`${base}\n\n围绕选题《${topicTitle}》展开，先结论后证据。`);
  };

  const regenerateOutline = () => {
    const suffix = outlineEdit.trim() ? `（按修改词：${outlineEdit.trim()}）` : "（轻微优化语序）";
    const base = selectedGene?.wechatOutlinePrompt ?? outline;
    setOutline(`${base}\n\n已重新生成${suffix}`);
  };

  const generateContent = () => {
    setContent(
      `【导语】${topicTitle} 正在重塑市场预期。\n【正文】围绕资金流、估值修复与产业兑现三条主线展开。\n【结论】短期关注交易节奏，中期关注业绩验证与政策信号。`
    );
  };

  const regenerateContent = () => {
    const suffix = contentEdit.trim() ? `（已按“${contentEdit.trim()}”调整）` : "（已优化表达）";
    setContent(
      `【导语】${topicTitle} 是本轮情绪与基本面共振点。\n【正文】结合宏观变量、资金流向、产业链景气度进行三段拆解。\n【结论】保持仓位纪律，优先跟踪高确定性标的。${suffix}`
    );
  };

  const generateTitle = () => {
    setTitle(`《${topicTitle}：从热点到策略，哪些方向最值得跟踪？》`);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Matrix Production"
        title="财经矩阵化出稿车间"
        description="公众号分步生成：大纲 → 内容 → 标题。"
      />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
          <h3 className="text-base font-semibold text-textMain">生成配置</h3>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-textMain">已选热点（只读）</span>
              <textarea
                readOnly
                value={selectedTopic?.title ?? matrixSelectedHotspot}
                className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-textMain outline-none"
              />
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
              <p>选题总结：{selectedTopic?.summary ?? "暂未从热点雷达采纳选题，当前展示默认热点。"}</p>
              <p className="mt-1">
                信息来源：{selectedTopic?.source ?? "财联社电报 - 10分钟前"}
                {selectedTopic?.sourceUrl ? (
                  <>
                    {" | "}
                    <a
                      href={selectedTopic.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent hover:underline"
                    >
                      查看原文
                    </a>
                  </>
                ) : null}
              </p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-textMain">大 V 风格选择（公众号）</span>
              <select
                value={selectedStyle}
                onChange={(event) => setSelectedStyle(event.target.value)}
                disabled={styleOptions.length === 0}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-textMain outline-none ring-accent/20 transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {styleOptions.length === 0 ? (
                  <option value="">暂无公众号风格基因</option>
                ) : (
                  styleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                )}
              </select>
            </label>

            <button
              type="button"
              onClick={generateOutline}
              disabled={styleOptions.length === 0}
              className="mt-2 w-full rounded-lg border border-accent/50 bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(47,129,247,0.25)] transition hover:bg-[#1e6fe0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              生成大纲
            </button>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-textMuted">
              平台：公众号 | 当前风格基因：{selectedStyle || "暂无"}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
            <h3 className="text-base font-semibold text-textMain">公众号（分步生成）</h3>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-textMain">Step 1：大纲</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs leading-6 text-slate-700">
                {outline || "请先点击【生成大纲】"}
              </pre>
              {outline ? (
                <div className="mt-3 space-y-2">
                  <input
                    value={outlineEdit}
                    onChange={(event) => setOutlineEdit(event.target.value)}
                    placeholder="输入修改词，如：更偏交易策略"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={regenerateOutline}
                      className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      修改大纲
                    </button>
                    <button
                      type="button"
                      onClick={generateContent}
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15"
                    >
                      生成内容
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-textMain">Step 2：内容</p>
              <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs leading-6 text-slate-700">
                {content || "大纲确认后，点击【生成内容】"}
              </pre>
              {content ? (
                <div className="mt-3 space-y-2">
                  <input
                    value={contentEdit}
                    onChange={(event) => setContentEdit(event.target.value)}
                    placeholder="输入修改词，如：更偏机构研报语气"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={regenerateContent}
                      className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      修改内容
                    </button>
                    <button
                      type="button"
                      onClick={generateTitle}
                      className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15"
                    >
                      生成标题
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-textMain">Step 3：标题</p>
              <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{title || "内容确认后，点击【生成标题】"}</p>
              {title ? (
                <button
                  type="button"
                  className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  下载到飞书
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
