"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MATRIX_TOPIC_STORAGE_KEY, radarHotspots } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

function defaultSelectedDate() {
  const today = new Date().toISOString().slice(0, 10);
  if (radarHotspots.some((h) => h.date === today)) return today;
  const sorted = [...new Set(radarHotspots.map((h) => h.date))].sort();
  return sorted[sorted.length - 1] ?? today;
}

export default function RadarPage() {
  const router = useRouter();
  const dateOptions = useMemo(
    () => [...new Set(radarHotspots.map((h) => h.date))].sort((a, b) => b.localeCompare(a)),
    []
  );
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

  const filteredHotspots = useMemo(
    () => radarHotspots.filter((item) => item.date === selectedDate),
    [selectedDate]
  );

  const handleAdoptTopic = (topic: (typeof radarHotspots)[number]) => {
    const payload = {
      id: topic.id,
      title: topic.theme,
      summary: topic.summary,
      outline: topic.outline,
      category: topic.category,
      sector: topic.sector,
      date: topic.date
    };
    window.localStorage.setItem(MATRIX_TOPIC_STORAGE_KEY, JSON.stringify(payload));
    router.push("/matrix-gen");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          eyebrow="Hotspot Radar"
          title="全网财经热点雷达"
          description="按日期筛选财经热点，辅助运营团队快速选材。"
        />
        <button
          type="button"
          className="h-fit rounded-lg border border-accent/50 bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(47,129,247,0.25)] transition hover:bg-[#1e6fe0]"
        >
          手动触发：获取最新快讯
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-panel p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-textMain">财经热点看板</h3>
          <label className="flex flex-wrap items-center gap-2 text-sm text-textMuted sm:justify-end">
            <span className="shrink-0 font-medium text-textMain">日期</span>
            <input
              type="date"
              value={selectedDate}
              min={dateOptions[dateOptions.length - 1]}
              max={dateOptions[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-textMain outline-none ring-accent/20 focus:ring-4"
            />
          </label>
        </div>

        {filteredHotspots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-textMuted">
            所选日期暂无热点，请切换日期筛选。
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredHotspots.map((item) => (
            <article
              key={item.id}
              className="flex min-h-56 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-panel"
            >
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-textMuted">日期</dt>
                  <dd className="mt-0.5 text-textMain">{item.date}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-textMuted">分类</dt>
                  <dd className="mt-0.5 text-textMain">{item.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-textMuted">主题</dt>
                  <dd className="mt-0.5 font-semibold leading-6 text-textMain">{item.theme}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-textMuted">板块</dt>
                  <dd className="mt-0.5 text-textMain">{item.sector}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-textMuted">总结</dt>
                  <dd className="mt-0.5 leading-5 text-slate-600">{item.summary}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-textMuted">新闻大纲</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700">
                    {item.outline}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => handleAdoptTopic(item)}
                className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                采纳为今日选题
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
