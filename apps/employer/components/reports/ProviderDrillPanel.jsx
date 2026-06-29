"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const APPRENTICES_BY_PROVIDER = {
  "Birmingham Met": [
    {
      name: "Jamie Okafor",
      otj: 68,
      attendance: 94,
      status: "on_track",
      epaDate: "Jan 2026",
    },
    {
      name: "Connor Walsh",
      otj: 88,
      attendance: 97,
      status: "epa_ready",
      epaDate: "Jul 2025",
    },
    {
      name: "Tom Griffiths",
      otj: 31,
      attendance: 92,
      status: "on_track",
      epaDate: "Jun 2026",
    },
  ],
  "Aston Training": [
    {
      name: "Priya Sharma",
      otj: 52,
      attendance: 81,
      status: "at_risk",
      epaDate: "Oct 2025",
    },
    {
      name: "Tom Griffiths",
      otj: 31,
      attendance: 92,
      status: "on_track",
      epaDate: "Jun 2026",
    },
  ],
  "WMG Academy": [
    {
      name: "Amara Diallo",
      otj: 44,
      attendance: 78,
      status: "overdue",
      epaDate: "Nov 2025",
    },
  ],
};

const STATUS_COLOR = {
  on_track: T.green,
  at_risk: T.amber,
  overdue: T.red,
  epa_ready: "#1847d4",
};
const STATUS_LABEL = {
  on_track: "On track",
  at_risk: "At risk",
  overdue: "Overdue",
  epa_ready: "EPA Ready",
};

export function ProviderDrillPanel({ provider, onClose, onContact }) {
  if (!provider) return null;
  const apprentices = APPRENTICES_BY_PROVIDER[provider.name] ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col shadow-2xl w-full sm:w-[440px]"
        style={{
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
              {provider.name}
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              {apprentices.length} learner{apprentices.length !== 1 ? "s" : ""}
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

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {apprentices.map((a, i) => {
            const sc = STATUS_COLOR[a.status] ?? T.muted;
            return (
              <div
                key={i}
                className="rounded-xl px-4 py-3"
                style={{
                  backgroundColor: T.card,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold" style={{ color: T.ink }}>
                    {a.name}
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${sc}15`, color: sc }}
                  >
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
                <div
                  className="flex gap-4 mt-1.5 text-[11px]"
                  style={{ color: T.muted }}
                >
                  <span>
                    OTJ:{" "}
                    <strong style={{ color: a.otj < 60 ? T.red : T.green }}>
                      {a.otj}%
                    </strong>
                  </span>
                  <span>
                    Att: <strong>{a.attendance}%</strong>
                  </span>
                  <span>EPA: {a.epaDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="shrink-0 px-5 py-4"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            onClick={() => onContact?.(provider)}
            className="w-full py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            Contact provider →
          </button>
        </div>
      </div>
    </>
  );
}
