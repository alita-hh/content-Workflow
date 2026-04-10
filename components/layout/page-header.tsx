"use client";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-accentGlow">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold text-textMain">{title}</h2>
      <p className="mt-1 text-sm text-textMuted">{description}</p>
    </header>
  );
}
