"use client";
import { Download, X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { ACTIVE_TRANSFERS, HISTORY } from "./data";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;
const STATUS_COLOR = {
  Complete: T.green,
  Active: T.blue,
  Cancelled: T.red,
  Expired: T.muted,
};

const ALL = [
  ...ACTIVE_TRANSFERS.map((t) => ({
    ...t,
    endDate: t.expectedEndDate,
    status: "Active",
  })),
  ...HISTORY,
];

export function HistoryDrawer({ onClose }) {
  const [tab, setTab] = useState("All");
  const TABS = [
    { key: "Active", label: `Active (${ACTIVE_TRANSFERS.length})` },
    { key: "Complete", label: `Complete (${HISTORY.length})` },
    { key: "All", label: `All (${ALL.length})` },
  ];
  const rows = tab === "All" ? ALL : ALL.filter((t) => t.status === tab);

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 480,
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Transfer history
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              Midlands Engineering Ltd — all levy transfers
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className="flex shrink-0 px-5"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150"
              style={{
                color: tab === key ? T.blue : T.muted,
                borderColor: tab === key ? T.blue : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {rows.map((t) => {
            const sc = STATUS_COLOR[t.status] ?? T.muted;
            return (
              <div
                key={t.id}
                className="px-5 py-3.5"
                style={{ borderBottom: `1px solid ${T.border}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: T.ink }}>
                      {t.recipient}
                    </p>
                    <p
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: T.muted }}
                    >
                      {t.id}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: `${sc}22`, color: sc }}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: T.muted }}>
                  {fmt(t.amount)} · {fmt(t.drawn)} drawn · {t.standard}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px]" style={{ color: T.muted }}>
                    {t.startDate} → {t.endDate}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                    style={{ color: T.blue }}
                  >
                    <Download className="h-3 w-3" /> Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="p-4 shrink-0"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Export all transfer history
            (CSV)
          </button>
        </div>
      </div>
    </>
  );
}
