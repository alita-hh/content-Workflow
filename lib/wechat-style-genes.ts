import { styleGenes } from "@/lib/mock-data";

export const WECHAT_STYLE_STORAGE_KEY = "fintech:wechatStyleGenes:v1";

export type WechatStyleGeneRow = {
  id: string;
  styleName: string;
  note: string;
  wechatOutlinePrompt: string;
  wechatBodyPrompt: string;
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

function formatUpdatedAt() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function touchUpdatedAt(row: WechatStyleGeneRow): WechatStyleGeneRow {
  return { ...row, updatedAt: formatUpdatedAt() };
}
