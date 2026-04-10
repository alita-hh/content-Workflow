// #region agent log
const DEBUG_INGEST =
  "http://127.0.0.1:7561/ingest/8af16603-505f-4aed-a559-9a5e21aa1068";

type AgentPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  runId?: string;
};

/** 双写：ingest + 同源 API 落盘（DEBUG） */
export function sendAgentDebugLog(payload: AgentPayload) {
  const body = JSON.stringify({
    sessionId: "710836",
    ...payload,
    timestamp: Date.now()
  });
  fetch(DEBUG_INGEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "710836"
    },
    body
  }).catch(() => {});
  fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  }).catch(() => {});
}
// #endregion
