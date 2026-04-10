import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <main className="ml-72 min-h-screen p-8">
        <div className="rounded-2xl border border-slate-200 bg-panel p-6 shadow-panel">{children}</div>
      </main>
    </div>
  );
}
