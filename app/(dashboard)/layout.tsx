import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";

function SidebarFallback() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-200 bg-panel px-4 py-6 shadow-panel">
      <div className="mb-8 px-2">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="space-y-2 px-2">
        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-9 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>
      <main className="ml-72 min-h-screen p-8">
        <div className="rounded-2xl border border-slate-200 bg-panel p-6 shadow-panel">{children}</div>
      </main>
    </div>
  );
}
