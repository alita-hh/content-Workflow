"use client";

import { useEffect, useMemo, useState } from "react";
import { sendAgentDebugLog } from "@/lib/debug-client-log";
import {
  defaultWechatRows,
  defaultXhsRows,
  loadWechatRows,
  loadXhsRows,
  saveWechatRows,
  saveXhsRows,
  touchUpdatedAt,
  touchUpdatedAtXhs,
  type WechatStyleGeneRow,
  type XhsStyleGeneRow
} from "@/lib/wechat-style-genes";
import { PageHeader } from "@/components/layout/page-header";

export default function StyleGeneHubPage() {
  const [activeTab, setActiveTab] = useState<"wechat" | "xhs">("wechat");
  const [wechatRows, setWechatRows] = useState<WechatStyleGeneRow[]>(defaultWechatRows);
  const [xhsRows, setXhsRows] = useState<XhsStyleGeneRow[]>(defaultXhsRows);
  const [search, setSearch] = useState("");
  const [editingWechat, setEditingWechat] = useState<WechatStyleGeneRow | null>(null);
  const [editingXhs, setEditingXhs] = useState<XhsStyleGeneRow | null>(null);
  const [wechatForm, setWechatForm] = useState({
    styleName: "",
    note: "",
    wechatOutlinePrompt: "",
    wechatBodyPrompt: ""
  });
  const [xhsForm, setXhsForm] = useState({
    styleName: "",
    persona: "",
    xhsArticlePrompt: ""
  });
  const [creatingXhs, setCreatingXhs] = useState(false);
  const [xhsCreateForm, setXhsCreateForm] = useState({
    styleName: "",
    persona: "",
    xhsArticlePrompt: ""
  });
  const [replicaOpen, setReplicaOpen] = useState(false);
  const [articleUrl, setArticleUrl] = useState("");
  const [bloggerName, setBloggerName] = useState("");
  const [bloggerAvatar, setBloggerAvatar] = useState("");
  const [analysisOutlinePrompt, setAnalysisOutlinePrompt] = useState("");
  const [analysisBodyPrompt, setAnalysisBodyPrompt] = useState("");
  const [replicaError, setReplicaError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [analyzingBlogger, setAnalyzingBlogger] = useState(false);
  const [savingReplica, setSavingReplica] = useState(false);

  useEffect(() => {
    setWechatRows(loadWechatRows());
    setXhsRows(loadXhsRows());
  }, []);

  useEffect(() => {
    // #region agent log
    sendAgentDebugLog({
      hypothesisId: "H_TAB_RENDER",
      location: "style-gene-hub/page.tsx:rows_loaded",
      message: "style_gene_rows_loaded",
      data: {
        wechatCount: wechatRows.length,
        xhsCount: xhsRows.length,
        activeTab
      },
      runId: "style-tab-debug-1"
    });
    // #endregion
  }, [wechatRows.length, xhsRows.length, activeTab]);

  const filteredWechat = useMemo(() => {
    const keyword = search.trim();
    return wechatRows.filter((item) => (keyword ? item.styleName.includes(keyword) : true));
  }, [wechatRows, search]);

  const filteredXhs = useMemo(() => {
    const keyword = search.trim();
    return xhsRows.filter((item) => (keyword ? item.styleName.includes(keyword) : true));
  }, [xhsRows, search]);

  const openWechatEdit = (row: WechatStyleGeneRow) => {
    setEditingWechat(row);
    setWechatForm({
      styleName: row.styleName,
      note: row.note,
      wechatOutlinePrompt: row.wechatOutlinePrompt,
      wechatBodyPrompt: row.wechatBodyPrompt
    });
  };

  const openXhsEdit = (row: XhsStyleGeneRow) => {
    setEditingXhs(row);
    setXhsForm({
      styleName: row.styleName,
      persona: row.persona,
      xhsArticlePrompt: row.xhsArticlePrompt
    });
  };

  const closeWechatEdit = () => {
    setEditingWechat(null);
  };

  const closeXhsEdit = () => {
    setEditingXhs(null);
  };

  const openXhsCreate = () => {
    setXhsCreateForm({
      styleName: "",
      persona: "",
      xhsArticlePrompt: ""
    });
    setCreatingXhs(true);
  };

  const closeXhsCreate = () => {
    setCreatingXhs(false);
  };

  const handleWechatSave = () => {
    if (!editingWechat) return;
    const next = wechatRows.map((r) =>
      r.id === editingWechat.id
        ? touchUpdatedAt({
            ...r,
            styleName: wechatForm.styleName.trim(),
            note: wechatForm.note.trim(),
            wechatOutlinePrompt: wechatForm.wechatOutlinePrompt.trim(),
            wechatBodyPrompt: wechatForm.wechatBodyPrompt.trim()
          })
        : r
    );
    setWechatRows(next);
    saveWechatRows(next);
    closeWechatEdit();
  };

  const handleXhsSave = () => {
    if (!editingXhs) return;
    const next = xhsRows.map((r) =>
      r.id === editingXhs.id
        ? touchUpdatedAtXhs({
            ...r,
            styleName: xhsForm.styleName.trim(),
            persona: xhsForm.persona.trim(),
            xhsArticlePrompt: xhsForm.xhsArticlePrompt.trim()
          })
        : r
    );
    setXhsRows(next);
    saveXhsRows(next);
    closeXhsEdit();
  };

  const handleXhsCreateSave = () => {
    const styleName = xhsCreateForm.styleName.trim();
    const persona = xhsCreateForm.persona.trim();
    const xhsArticlePrompt = xhsCreateForm.xhsArticlePrompt.trim();
    if (!styleName) return;
    const nextItem: XhsStyleGeneRow = touchUpdatedAtXhs({
      id: `xhs-${Date.now()}`,
      styleName,
      persona,
      xhsArticlePrompt,
      updatedAt: ""
    });
    const nextRows = [nextItem, ...xhsRows];
    setXhsRows(nextRows);
    saveXhsRows(nextRows);
    // #region agent log
    sendAgentDebugLog({
      hypothesisId: "H_XHS_CREATE_SAVE",
      location: "style-gene-hub/page.tsx:handleXhsCreateSave",
      message: "xhs_style_created",
      data: {
        styleNameLen: styleName.length,
        hasPersona: Boolean(persona),
        hasPrompt: Boolean(xhsArticlePrompt),
        totalRows: nextRows.length
      },
      runId: "xhs-create-flow-1"
    });
    // #endregion
    closeXhsCreate();
  };

  const handleWechatDelete = (id: string) => {
    if (!window.confirm("确定删除该条风格基因？")) return;
    const next = wechatRows.filter((r) => r.id !== id);
    setWechatRows(next);
    saveWechatRows(next);
    if (editingWechat?.id === id) closeWechatEdit();
  };

  const handleXhsDelete = (id: string) => {
    if (!window.confirm("确定删除该条风格基因？")) return;
    const next = xhsRows.filter((r) => r.id !== id);
    setXhsRows(next);
    saveXhsRows(next);
    if (editingXhs?.id === id) closeXhsEdit();
  };

  const openReplicaModal = () => {
    setReplicaOpen(true);
    setReplicaError("");
  };

  const closeReplicaModal = () => {
    setReplicaOpen(false);
    setReplicaError("");
  };

  const handleFetchProfile = async () => {
    setReplicaError("");
    setLoadingProfile(true);
    setAnalysisOutlinePrompt("");
    setAnalysisBodyPrompt("");
    try {
      const response = await fetch("/api/wechat-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleUrl })
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setReplicaError(data?.error ?? "获取失败，请重试");
        return;
      }
      setBloggerName(data.bloggerName ?? "");
      setBloggerAvatar(data.avatar ?? "");
      // #region agent log
      sendAgentDebugLog({
        hypothesisId: "H_REPLICA_GET",
        location: "style-gene-hub/page.tsx:handleFetchProfile",
        message: "wechat_blogger_profile_fetched",
        data: {
          hasName: Boolean(data.bloggerName),
          hasAvatar: Boolean(data.avatar)
        },
        runId: "replica-flow-1"
      });
      // #endregion
    } catch {
      setReplicaError("网络异常，请稍后重试");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAnalyzeBlogger = async () => {
    setReplicaError("");
    setAnalyzingBlogger(true);
    try {
      const response = await fetch("/api/wechat-style-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleUrl, bloggerName })
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setReplicaError(data?.error ?? "分析失败，请重试");
        return;
      }
      setAnalysisOutlinePrompt(data.outlinePrompt ?? "");
      setAnalysisBodyPrompt(data.bodyPrompt ?? "");
      // #region agent log
      sendAgentDebugLog({
        hypothesisId: "H_REPLICA_ANALYZE",
        location: "style-gene-hub/page.tsx:handleAnalyzeBlogger",
        message: "wechat_blogger_analysis_completed",
        data: {
          outlineLen: (data.outlinePrompt ?? "").length,
          bodyLen: (data.bodyPrompt ?? "").length
        },
        runId: "replica-flow-1"
      });
      // #endregion
    } catch {
      setReplicaError("网络异常，请稍后重试");
    } finally {
      setAnalyzingBlogger(false);
    }
  };

  const handleSaveReplica = async () => {
    if (!analysisOutlinePrompt.trim() || !analysisBodyPrompt.trim()) return;
    setReplicaError("");
    setSavingReplica(true);
    try {
      const styleName = `${bloggerName || "博主"}风格复刻`;
      const nextRow: WechatStyleGeneRow = touchUpdatedAt({
        id: `replica-${Date.now()}`,
        styleName,
        note: `来源链接：${articleUrl.trim() || "-"}`,
        wechatOutlinePrompt: analysisOutlinePrompt.trim(),
        wechatBodyPrompt: analysisBodyPrompt.trim(),
        updatedAt: ""
      });
      const nextRows = [nextRow, ...wechatRows];
      setWechatRows(nextRows);
      saveWechatRows(nextRows);
      // #region agent log
      sendAgentDebugLog({
        hypothesisId: "H_REPLICA_SAVE",
        location: "style-gene-hub/page.tsx:handleSaveReplica",
        message: "wechat_blogger_analysis_saved",
        data: {
          savedStyleName: styleName,
          totalRows: nextRows.length
        },
        runId: "replica-flow-1"
      });
      // #endregion
      setReplicaOpen(false);
    } finally {
      setSavingReplica(false);
    }
  };

  useEffect(() => {
    // #region agent log
    sendAgentDebugLog({
      hypothesisId: "H_TAB_SWITCH",
      location: "style-gene-hub/page.tsx:tab_switch",
      message: "style_gene_tab_switched",
      data: { activeTab },
      runId: "style-tab-debug-1"
    });
    // #endregion
  }, [activeTab]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Style Gene Management"
        title="风格基因管理后台"
        description="管理公众号与小红书风格基因资产。"
      />

      <div className="rounded-xl border border-slate-200 bg-panel p-5 shadow-panel">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("wechat")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              activeTab === "wechat"
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-slate-200 bg-white text-textMuted hover:bg-slate-50"
            }`}
          >
            公众号
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("xhs")}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              activeTab === "xhs"
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-slate-200 bg-white text-textMuted hover:bg-slate-50"
            }`}
          >
            小红书
          </button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-textMain">
              {activeTab === "wechat" ? "公众号风格资产列表" : "小红书风格资产列表"}
            </h3>
            <p className="mt-1 text-sm text-textMuted">支持按风格名称模糊检索、编辑和删除。</p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            {activeTab === "xhs" ? (
              <button
                type="button"
                onClick={openXhsCreate}
                className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/15"
              >
                创建
              </button>
            ) : null}
            {activeTab === "wechat" ? (
              <button
                type="button"
                onClick={openReplicaModal}
                className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/15"
              >
                博主风格复刻
              </button>
            ) : null}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="按风格名称搜索"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-textMain outline-none ring-accent/20 transition placeholder:text-slate-400 focus:ring-4 md:w-72"
            />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          {activeTab === "wechat" ? (
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
                {filteredWechat.map((item) => (
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
                          onClick={() => openWechatEdit(item)}
                          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWechatDelete(item.id)}
                          className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredWechat.length === 0 ? (
                  <tr className="border-t border-slate-200">
                    <td colSpan={6} className="px-4 py-6 text-center text-textMuted">
                      无匹配数据，请调整检索关键词。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-left text-textMuted">
                <tr>
                  <th className="px-4 py-3 font-medium">风格名称</th>
                  <th className="px-4 py-3 font-medium">人设</th>
                  <th className="px-4 py-3 font-medium">文章 Promt</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredXhs.map((item) => (
                  <tr key={item.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-textMain">{item.styleName}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-textMuted" title={item.persona}>
                      {item.persona || "-"}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3 text-textMain" title={item.xhsArticlePrompt}>
                      {item.xhsArticlePrompt || "-"}
                    </td>
                    <td className="px-4 py-3 text-textMuted">{item.updatedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openXhsEdit(item)}
                          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent/15"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleXhsDelete(item.id)}
                          className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredXhs.length === 0 ? (
                  <tr className="border-t border-slate-200">
                    <td colSpan={5} className="px-4 py-6 text-center text-textMuted">
                      无匹配数据，请调整检索关键词。
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editingWechat ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-style-gene-title"
          onClick={closeWechatEdit}
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
                  value={wechatForm.styleName}
                  onChange={(e) => setWechatForm((f) => ({ ...f, styleName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">备注</span>
                <textarea
                  value={wechatForm.note}
                  onChange={(e) => setWechatForm((f) => ({ ...f, note: e.target.value }))}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">框架 Prompt</span>
                <textarea
                  value={wechatForm.wechatOutlinePrompt}
                  onChange={(e) => setWechatForm((f) => ({ ...f, wechatOutlinePrompt: e.target.value }))}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">正文 Prompt</span>
                <textarea
                  value={wechatForm.wechatBodyPrompt}
                  onChange={(e) => setWechatForm((f) => ({ ...f, wechatBodyPrompt: e.target.value }))}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeWechatEdit}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleWechatSave}
                className="rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e6fe0]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editingXhs ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-xhs-style-gene-title"
          onClick={closeXhsEdit}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="edit-xhs-style-gene-title" className="text-lg font-semibold text-textMain">
              编辑小红书风格基因
            </h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">风格名称</span>
                <input
                  value={xhsForm.styleName}
                  onChange={(e) => setXhsForm((f) => ({ ...f, styleName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">人设</span>
                <textarea
                  value={xhsForm.persona}
                  onChange={(e) => setXhsForm((f) => ({ ...f, persona: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">文章 Promt</span>
                <textarea
                  value={xhsForm.xhsArticlePrompt}
                  onChange={(e) => setXhsForm((f) => ({ ...f, xhsArticlePrompt: e.target.value }))}
                  rows={5}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeXhsEdit}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleXhsSave}
                className="rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e6fe0]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {creatingXhs ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-xhs-style-gene-title"
          onClick={closeXhsCreate}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="create-xhs-style-gene-title" className="text-lg font-semibold text-textMain">
              创建风格
            </h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">风格名称</span>
                <input
                  value={xhsCreateForm.styleName}
                  onChange={(e) => setXhsCreateForm((f) => ({ ...f, styleName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">人设</span>
                <textarea
                  value={xhsCreateForm.persona}
                  onChange={(e) => setXhsCreateForm((f) => ({ ...f, persona: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-textMain">文章 Promt</span>
                <textarea
                  value={xhsCreateForm.xhsArticlePrompt}
                  onChange={(e) => setXhsCreateForm((f) => ({ ...f, xhsArticlePrompt: e.target.value }))}
                  rows={5}
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeXhsCreate}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleXhsCreateSave}
                className="rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e6fe0]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {replicaOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wechat-replica-title"
          onClick={closeReplicaModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="wechat-replica-title" className="text-lg font-semibold text-textMain">
              博主风格复刻
            </h3>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-textMain">公众号文章地址链接</label>
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    placeholder="请输入公众号文章URL"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                  />
                  <button
                    type="button"
                    onClick={handleFetchProfile}
                    disabled={loadingProfile || !articleUrl.trim()}
                    className="rounded-lg border border-accent/50 bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingProfile ? "获取中..." : "获取"}
                  </button>
                </div>
              </div>

              {bloggerName ? (
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  {bloggerAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bloggerAvatar} alt={bloggerName} className="h-10 w-10 rounded-full border border-slate-200" />
                  ) : null}
                  <p className="text-sm text-textMain">
                    已识别公众号：<span className="font-semibold">{bloggerName}</span>
                  </p>
                </div>
              ) : null}

              <div>
                <button
                  type="button"
                  onClick={handleAnalyzeBlogger}
                  disabled={analyzingBlogger || !articleUrl.trim() || !bloggerName}
                  className="rounded-lg border border-emerald-400 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {analyzingBlogger ? "分析中..." : "分析博主"}
                </button>
              </div>

              {analysisOutlinePrompt || analysisBodyPrompt ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-textMain">大纲 Promt</span>
                    <textarea
                      value={analysisOutlinePrompt}
                      onChange={(e) => setAnalysisOutlinePrompt(e.target.value)}
                      rows={5}
                      className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-textMain">正文 Promt</span>
                    <textarea
                      value={analysisBodyPrompt}
                      onChange={(e) => setAnalysisBodyPrompt(e.target.value)}
                      rows={6}
                      className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-accent/20 focus:ring-4"
                    />
                  </label>
                </div>
              ) : null}

              {replicaError ? <p className="text-sm text-rose-600">{replicaError}</p> : null}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="flex items-center gap-2">
                {analysisOutlinePrompt || analysisBodyPrompt ? (
                  <button
                    type="button"
                    onClick={handleSaveReplica}
                    disabled={savingReplica}
                    className="rounded-lg border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingReplica ? "保存中..." : "保存"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeReplicaModal}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
