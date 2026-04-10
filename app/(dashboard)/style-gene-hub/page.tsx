"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultWechatRows,
  loadWechatRows,
  saveWechatRows,
  touchUpdatedAt,
  type WechatStyleGeneRow
} from "@/lib/wechat-style-genes";
import { PageHeader } from "@/components/layout/page-header";

export default function StyleGeneHubPage() {
  const [rows, setRows] = useState<WechatStyleGeneRow[]>(defaultWechatRows);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<WechatStyleGeneRow | null>(null);
  const [form, setForm] = useState({
    styleName: "",
    note: "",
    wechatOutlinePrompt: "",
    wechatBodyPrompt: ""
  });

  useEffect(() => {
    setRows(loadWechatRows());
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim();
    return rows.filter((item) => (keyword ? item.styleName.includes(keyword) : true));
  }, [rows, search]);

  const openEdit = (row: WechatStyleGeneRow) => {
    setEditing(row);
    setForm({
      styleName: row.styleName,
      note: row.note,
      wechatOutlinePrompt: row.wechatOutlinePrompt,
      wechatBodyPrompt: row.wechatBodyPrompt
    });
  };

  const closeEdit = () => {
    setEditing(null);
  };

  const handleSave = () => {
    if (!editing) return;
    const next = rows.map((r) =>
      r.id === editing.id
        ? touchUpdatedAt({
            ...r,
            styleName: form.styleName.trim(),
            note: form.note.trim(),
            wechatOutlinePrompt: form.wechatOutlinePrompt.trim(),
            wechatBodyPrompt: form.wechatBodyPrompt.trim()
          })
        : r
    );
    setRows(next);
    saveWechatRows(next);
    closeEdit();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("确定删除该条风格基因？")) return;
    const next = rows.filter((r) => r.id !== id);
    setRows(next);
    saveWechatRows(next);
    if (editing?.id === id) closeEdit();
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Style Gene Management"
        title="风格基因管理后台"
        description="管理公众号风格基因资产（框架 / 正文 Prompt）。"
      />

      <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-textMain">公众号风格资产列表</h3>
            <p className="mt-1 text-sm text-textMuted">支持按风格名称模糊检索、编辑和删除。</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="按风格名称搜索"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-textMain outline-none ring-accent/20 transition placeholder:text-slate-400 focus:ring-4 md:w-72"
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-textMuted">
              <tr>
                <th className="px-4 py-3 font-medium">风格名称</th>
                <th className="px-4 py-3 font-medium">备注</th>
                <th className="px-4 py-3 font-medium">框架 Prompt</th>
                <th className="px-4 py-3 font-medium">正文 Prompt</th>
                <th className="px-4 py-3 font-medium">更新时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-textMain">{item.styleName}</td>
                  <td className="px-4 py-3 text-textMuted">{item.note}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-textMain" title={item.wechatOutlinePrompt}>
                    {item.wechatOutlinePrompt || "-"}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-textMain" title={item.wechatBodyPrompt}>
                    {item.wechatBodyPrompt || "-"}
                  </td>
                  <td className="px-4 py-3 text-textMuted">{item.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr className="border-t border-slate-200">
                  <td colSpan={6} className="px-4 py-6 text-center text-textMuted">
                    无匹配数据，请调整检索关键词。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-style-gene-title"
          onClick={closeEdit}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="edit-style-gene-title" className="text-lg font-semibold text-textMain">
              编辑风格基因
            </h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">风格名称</span>
                <input
                  value={form.styleName}
                  onChange={(e) => setForm((f) => ({ ...f, styleName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">备注</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">框架 Prompt</span>
                <textarea
                  value={form.wechatOutlinePrompt}
                  onChange={(e) => setForm((f) => ({ ...f, wechatOutlinePrompt: e.target.value }))}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">正文 Prompt</span>
                <textarea
                  value={form.wechatBodyPrompt}
                  onChange={(e) => setForm((f) => ({ ...f, wechatBodyPrompt: e.target.value }))}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e6fe0]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
