"use client";

import { useMemo, useState } from "react";
import { styleGenes } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

type GeneTab = "xhs" | "wechat";

export default function StyleGeneHubPage() {
  const [tab, setTab] = useState<GeneTab>("xhs");
  const [search, setSearch] = useState("");

  const platformName = tab === "xhs" ? "小红书" : "公众号";

  const filteredGenes = useMemo(() => {
    const keyword = search.trim();
    return styleGenes.filter((item) => {
      const platformMatch = tab === "xhs" ? item.platform === "小红书" : item.platform === "公众号";
      const nameMatch = keyword ? item.bloggerName.includes(keyword) : true;
      return platformMatch && nameMatch;
    });
  }, [tab, search]);

  const xhsGenes = filteredGenes.filter((item) => item.platform === "小红书");
  const wechatGenes = filteredGenes.filter((item) => item.platform === "公众号");

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Style Gene Management"
        title="风格基因管理后台"
        description="独立管理小红书与公众号两类风格资产。"
      />

      <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => setTab("xhs")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "xhs" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
            }`}
          >
            小红书 Tab
          </button>
          <button
            type="button"
            onClick={() => setTab("wechat")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "wechat" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
            }`}
          >
            公众号 Tab
          </button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-textMain">{platformName}风格资产列表</h3>
            <p className="mt-1 text-sm text-textMuted">支持按博主名称模糊检索、编辑和删除。</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`按${platformName}博主名称搜索`}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-textMain outline-none ring-accent/20 transition placeholder:text-slate-400 focus:ring-4 md:w-72"
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-textMuted">
              {tab === "xhs" ? (
                <tr>
                  <th className="px-4 py-3 font-medium">博主名称</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                  <th className="px-4 py-3 font-medium">图片 Prompt</th>
                  <th className="px-4 py-3 font-medium">内容 Prompt</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-4 py-3 font-medium">博主名称</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                  <th className="px-4 py-3 font-medium">标题 Prompt</th>
                  <th className="px-4 py-3 font-medium">内容框架 Prompt</th>
                  <th className="px-4 py-3 font-medium">内容正文 Prompt</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              )}
            </thead>
            <tbody>
              {tab === "xhs"
                ? xhsGenes.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-textMain">{item.bloggerName}</td>
                      <td className="px-4 py-3 text-textMuted">{item.note}</td>
                      <td className="px-4 py-3 text-textMain">{item.xhsImagePrompt ?? "-"}</td>
                      <td className="px-4 py-3 text-textMain">{item.xhsContentPrompt ?? "-"}</td>
                      <td className="px-4 py-3 text-textMuted">{item.updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : wechatGenes.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-textMain">{item.bloggerName}</td>
                      <td className="px-4 py-3 text-textMuted">{item.note}</td>
                      <td className="px-4 py-3 text-textMain">{item.wechatTitlePrompt ?? "-"}</td>
                      <td className="px-4 py-3 text-textMain">{item.wechatOutlinePrompt ?? "-"}</td>
                      <td className="px-4 py-3 text-textMain">{item.wechatBodyPrompt ?? "-"}</td>
                      <td className="px-4 py-3 text-textMuted">{item.updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              {filteredGenes.length === 0 ? (
                <tr className="border-t border-slate-200">
                  <td colSpan={tab === "xhs" ? 6 : 7} className="px-4 py-6 text-center text-textMuted">
                    当前 Tab 无匹配数据，请调整检索关键词。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
