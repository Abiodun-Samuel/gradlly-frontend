"use client";
import { Download, RefreshCw } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

import { REPORTS } from "./data";

const BADGE = {
  PDF: { bg: "#fee2e2", color: "#c0272d" },
  CSV: { bg: T.greenLight, color: T.green },
  Live: { bg: T.amberLight, color: T.amber },
  Scheduled: { bg: T.blueLight, color: T.blue },
};

function ReportRow({ report, onOpen, index }) {
  const { title, sub, badge, icon, lastGenerated } = report;
  const bm = BADGE[badge] ?? BADGE.PDF;
  const isLive = badge === "Live";
  return (
    <div
      className="flex items-start gap-3 px-4 py-4 cursor-pointer group transition-colors flex-wrap sm:flex-nowrap sm:gap-4 sm:px-5"
      style={{
        borderBottom: `1px solid ${T.border}`,
        animation: `slide-up 220ms var(--ease-out) ${index * 55}ms both`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.card)}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
      onClick={() => onOpen(report)}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl shrink-0"
        style={{ backgroundColor: T.card }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: T.ink }}>
          {title}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          {sub}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: T.subtle }}>
          Last generated: {lastGenerated}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: bm.bg, color: bm.color }}
        >
          {badge}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(report);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
          style={{
            border: `1.5px solid ${T.blue}`,
            color: T.blue,
            backgroundColor: "transparent",
          }}
        >
          {isLive ? (
            <RefreshCw className="h-3 w-3" />
          ) : (
            <Download className="h-3 w-3" />
          )}
          {isLive ? "Refresh" : "Generate"}
        </button>
      </div>
    </div>
  );
}

export function ReportList({ onOpen }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <p className="text-sm font-bold" style={{ color: T.ink }}>
          Available reports
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          {REPORTS.length} reports · click any row to preview or set date range
        </p>
      </div>
      {REPORTS.map((r, i) => (
        <ReportRow key={r.id} report={r} onOpen={onOpen} index={i} />
      ))}
    </div>
  );
}
