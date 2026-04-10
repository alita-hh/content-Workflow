import { ClientSidebar } from "@/components/layout/client-sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg">
      <ClientSidebar />
      <main className="ml-72 min-h-screen p-8">
        <div className="rounded-2xl border border-slate-200 bg-panel p-6 shadow-panel">{children}</div>
      </main>
    </div>
  );
}
