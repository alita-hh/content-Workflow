"use client";

import { useEffect } from "react";
import { sendAgentDebugLog } from "@/lib/debug-client-log";

/** 运行时探针：验证客户端是否完成挂载、样式表与 Next 构建信息（DEBUG） */
export function DebugProbe() {
  useEffect(() => {
    const w = window as Window & { __NEXT_DATA__?: { buildId?: string } };
    const nextData = w.__NEXT_DATA__;
    const linkEls = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    ) as HTMLLinkElement[];
    sendAgentDebugLog({
      hypothesisId: "H1-H2",
      location: "debug-probe.tsx:mount",
      message: "client_mount_probe",
      data: {
        href: window.location.href,
        styleSheetCount: document.styleSheets?.length ?? -1,
        scriptTagCount: document.scripts?.length ?? -1,
        buildId: nextData?.buildId ?? "missing",
        dataAppBuildId:
          document.documentElement.getAttribute("data-app-build-id") ?? "missing",
        cssHrefs: linkEls.map((l) => l.href).slice(0, 6)
      },
      runId: "debug-pull-3"
    });
  }, []);
  return null;
}
