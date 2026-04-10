"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-200 bg-panel px-4 py-6 shadow-panel">
      <div className="mb-8 px-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accentGlow">FinTech Ops</p>
        <h1 className="mt-2 text-lg font-semibold text-textMain">财经内容工作流</h1>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-transparent text-textMuted hover:border-slate-200 hover:bg-panelSoft hover:text-textMain"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
