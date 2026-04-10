"use client";

import { useMemo, useState } from "react";
import { collectionCrawlResults, collectionViralPosts } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

type TabKey = "viral" | "kv";

export default function CollectionPage() {
  const [tab, setTab] = useState<TabKey>("viral");
  const [keyword, setKeyword] = useState("红利低波");

  const filteredPosts = useMemo(() => {
    return collectionViralPosts.filter((item) => item.title.includes(keyword.trim()));
  }, [keyword]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Competitive Intelligence"
        title="竞品与素材采集"
        description="跨平台追踪爆款图文，批量采集大 V 历史内容资产。"
      />

      <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
        <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => setTab("viral")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "viral" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
            }`}
          >
            跨平台爆款追踪
          </button>
          <button
            type="button"
            onClick={() => setTab("kv")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === "kv" ? "bg-accent text-white" : "bg-slate-100 text-textMuted hover:bg-slate-200"
            }`}
          >
            大 V 批量采集
          </button>
        </div>

        {tab === "viral" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-textMain">关键词检索</span>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="请输入关键词，例如：红利低波"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-textMain outline-none ring-accent/20 transition placeholder:text-slate-400 focus:ring-4"
              />
            </label>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-slate-50 text-left text-textMuted">
                  <tr>
                    <th className="px-4 py-3 font-medium">标题</th>
                    <th className="px-4 py-3 font-medium">平台</th>
                    <th className="px-4 py-3 font-medium">点赞量</th>
                    <th className="px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-textMain">{item.title}</td>
                      <td className="px-4 py-3 text-textMuted">{item.platform}</td>
                      <td className="px-4 py-3 text-textMain">{item.likes}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                        >
                          推送至飞书
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 ? (
                    <tr className="border-t border-slate-200">
                      <td colSpan={4} className="px-4 py-6 text-center text-textMuted">
                        暂无匹配结果，请尝试其他关键词。
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-textMain">输入公众号链接或小红书主页</span>
              <input
                defaultValue="https://mp.weixin.qq.com/s/ze-ping-macro"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-textMain outline-none ring-accent/20 transition focus:ring-4"
              />
            </label>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-textMain">采集进度</span>
                <span className="font-medium text-accent">68%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[68%] rounded-full bg-accent" />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-medium text-textMain">采集结果列表</h3>
              <ul className="mt-3 space-y-2 text-sm text-textMuted">
                {collectionCrawlResults.map((item) => (
                  <li key={item} className="rounded-md bg-white px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
