import { styleGenes } from "@/lib/mock-data";

export const WECHAT_STYLE_STORAGE_KEY = "fintech:wechatStyleGenes:v1";
export const XHS_STYLE_STORAGE_KEY = "fintech:xhsStyleGenes:v1";

export type WechatStyleGeneRow = {
  id: string;
  styleName: string;
  note: string;
  wechatOutlinePrompt: string;
  wechatBodyPrompt: string;
  updatedAt: string;
};

export type XhsStyleGeneRow = {
  id: string;
  styleName: string;
  persona: string;
  xhsArticlePrompt: string;
  updatedAt: string;
};

export const WECHAT_STYLE_GENES_CHANGED = "wechat-style-genes-changed";

export function defaultWechatRows(): WechatStyleGeneRow[] {
  return styleGenes
    .filter((g) => g.platform === "公众号")
    .map((g) => ({
      id: g.id,
      styleName: g.styleName,
      note: g.note,
      wechatOutlinePrompt: g.wechatOutlinePrompt ?? "",
      wechatBodyPrompt: g.wechatBodyPrompt ?? "",
      updatedAt: g.updatedAt
    }));
}

export function defaultXhsRows(): XhsStyleGeneRow[] {
  return styleGenes
    .filter((g) => g.platform === "小红书")
    .map((g) => ({
      id: g.id,
      styleName: g.styleName,
      persona: g.note,
      xhsArticlePrompt: g.xhsContentPrompt ?? "",
      updatedAt: g.updatedAt
    }));
}

export function loadWechatRows(): WechatStyleGeneRow[] {
  if (typeof window === "undefined") return defaultWechatRows();
  try {
    const raw = localStorage.getItem(WECHAT_STYLE_STORAGE_KEY);
    if (!raw) return defaultWechatRows();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultWechatRows();
    return parsed as WechatStyleGeneRow[];
  } catch {
    return defaultWechatRows();
  }
}

export function saveWechatRows(rows: WechatStyleGeneRow[]) {
  localStorage.setItem(WECHAT_STYLE_STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent(WECHAT_STYLE_GENES_CHANGED));
}

export function loadXhsRows(): XhsStyleGeneRow[] {
  if (typeof window === "undefined") return defaultXhsRows();
  try {
    const raw = localStorage.getItem(XHS_STYLE_STORAGE_KEY);
    if (!raw) return defaultXhsRows();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return defaultXhsRows();
    return parsed as XhsStyleGeneRow[];
  } catch {
    return defaultXhsRows();
  }
}

export function saveXhsRows(rows: XhsStyleGeneRow[]) {
  localStorage.setItem(XHS_STYLE_STORAGE_KEY, JSON.stringify(rows));
}

function formatUpdatedAt() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function touchUpdatedAt(row: WechatStyleGeneRow): WechatStyleGeneRow {
  return { ...row, updatedAt: formatUpdatedAt() };
}

export function touchUpdatedAtXhs(row: XhsStyleGeneRow): XhsStyleGeneRow {
  return { ...row, updatedAt: formatUpdatedAt() };
}
