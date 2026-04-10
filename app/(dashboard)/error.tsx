"use client";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-textMain">
      <h2 className="text-lg font-semibold text-rose-800">页面加载出错</h2>
      <p className="mt-2 text-sm text-rose-700">
        {process.env.NODE_ENV === "development" ? error.message : "请尝试点击下方按钮重试，或强制刷新页面（Cmd+Shift+R）。"}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100"
      >
        重试
      </button>
    </div>
  );
}
