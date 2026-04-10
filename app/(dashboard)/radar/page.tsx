"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MATRIX_TOPIC_STORAGE_KEY, radarHotspots } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";

type TimeRange = "today" | "3d" | "7d" | "all";

function startOfLocalDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function publishedAtFromHoursAgo(now: Date, hoursAgo: number) {
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function matchesTimeRange(published: Date, range: TimeRange, now: Date) {
  if (range === "all") return true;
  const sod = startOfLocalDay(now);
  if (range === "today") {
    const next = new Date(sod);
    next.setDate(next.getDate() + 1);
    return published >= sod && published < next;
  }
  if (range === "3d") {
    const from = new Date(sod);
    from.setDate(from.getDate() - 2);
    return published >= from;
  }
  if (range === "7d") {
    const from = new Date(sod);
    from.setDate(from.getDate() - 6);
    return published >= from;
  }
  return true;
}

export default function RadarPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const filteredHotspots = useMemo(() => {
    if (!now) {
      return radarHotspots;
    }
    return radarHotspots.filter((item) => {
      const published = publishedAtFromHoursAgo(now, item.hoursAgo);
      return matchesTimeRange(published, timeRange, now);
    });
  }, [now, timeRange]);

  const handleAdoptTopic = (topic: (typeof radarHotspots)[number]) => {
    const payload = {
      id: topic.id,
      title: topic.title,
      summary: topic.summary,
      source: topic.source,
      sourceUrl: topic.sourceUrl
    };
    window.localStorage.setItem(MATRIX_TOPIC_STORAGE_KEY, JSON.stringify(payload));
    router.push("/matrix-gen");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          eyebrow="Realtime Feed"
          title="全网财经热点雷达"
          description="全天候抓取财经快讯，辅助运营团队快速选材。"
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
          <h3 className="text-lg font-semibold text-textMain">今日财经热点看板</h3>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-textMuted">
              <span className="shrink-0 font-medium text-textMain">时间</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-textMain outline-none ring-accent/20 focus:ring-4"
              >
                <option value="today">今天</option>
                <option value="3d">近 3 天</option>
                <option value="7d">近 7 天</option>
                <option value="all">全部</option>
              </select>
            </label>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-textMuted">
              实时刷新中
            </span>
          </div>
        </div>

        {filteredHotspots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-textMuted">
            当前时间范围内暂无热点，请切换筛选条件。
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredHotspots.map((item) => (
            <article key={item.id} className="flex min-h-56 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
              <div>
                <h4 className="text-base font-semibold leading-6 text-textMain">{item.title}</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accentGlow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-textMuted">{item.source}</p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                >
                  来源链接：{item.sourceUrl}
                </a>
                <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                  文章总结：{item.summary}
                </p>
              </div>

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
