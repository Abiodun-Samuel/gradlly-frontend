"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { ACTIVE_TRANSFERS, PIPELINE_STAGES } from "./data";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;

function Pipeline({ current }) {
  const idx = PIPELINE_STAGES.indexOf(current);
  return (
    <div className="overflow-x-auto">
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ border: `1px solid ${T.border}`, minWidth: 280 }}
      >
        {PIPELINE_STAGES.map((s, i) => (
          <div
            key={s}
            className="flex-1 text-center py-1.5 text-[9px] font-bold tracking-wide transition-colors whitespace-nowrap"
            style={{
              backgroundColor:
                i < idx ? T.greenLight : i === idx ? T.green : T.card,
              color: i < idx ? T.green : i === idx ? "#fff" : T.muted,
              borderRight:
                i < PIPELINE_STAGES.length - 1
                  ? `1px solid ${T.border}`
                  : "none",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Check() {
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
      style={{ backgroundColor: T.green }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path
          d="M2 6.5l3.5 3.5 5.5-6"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function TransferRow({ t }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round((t.drawn / t.amount) * 100);
  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="flex items-start gap-3.5 px-5 py-4">
        <Check />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                {t.recipient}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                {fmt(t.amount)} · Active since {t.startDate}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-[11px] font-semibold hover:opacity-70 shrink-0 mt-0.5"
              style={{ color: T.muted }}
            >
              {open ? "Less" : "Details"}
              <ChevronDown
                className="h-3 w-3 transition-transform"
                style={{ transform: open ? "rotate(180deg)" : "" }}
              />
            </button>
          </div>
          <div className="mt-2.5">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: T.border }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: T.green,
                  transition: "width 600ms ease-out",
                }}
              />
            </div>
            <p className="text-[10px] mt-1" style={{ color: T.muted }}>
              {fmt(t.drawn)} drawn of {fmt(t.amount)} ·{" "}
              <span style={{ color: T.green, fontWeight: 600 }}>{pct}%</span>
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="px-5 pb-4 ml-11 space-y-3"
          style={{ animation: "slide-up 250ms var(--ease-out) both" }}
        >
          <div
            className="rounded-xl p-3 space-y-1.5"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            {[
              ["Apprentice", t.apprentice],
              ["Standard", t.standard],
              ["Provider", t.provider],
              ["Period", `${t.startDate} → ${t.expectedEndDate}`],
              ["Drawdown", `${fmt(t.monthlyDrawdown)}/month`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 text-[11px]">
                <span
                  className="w-20 shrink-0 font-semibold"
                  style={{ color: T.muted }}
                >
                  {k}
                </span>
                <span style={{ color: T.ink }}>{v}</span>
              </div>
            ))}
          </div>
          {t.history.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: `1px solid ${T.border}` }}
            >
              <div
                className="grid grid-cols-3 px-3 py-1.5 text-[10px] font-semibold"
                style={{ backgroundColor: T.card, color: T.muted }}
              >
                {["Month", "Amount", "Cumulative"].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              {t.history.map((h) => (
                <div
                  key={h.month}
                  className="grid grid-cols-3 px-3 py-1.5 text-[11px]"
                  style={{ color: T.ink, borderTop: `1px solid ${T.border}` }}
                >
                  <span>{h.month}</span>
                  <span>{fmt(h.amount)}</span>
                  <span>{fmt(h.cumulative)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 pt-0.5">
            {["Compliance doc", "Contact recipient", "Download report"].map(
              (a) => (
                <button
                  key={a}
                  type="button"
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border hover:opacity-75 transition-opacity"
                  style={{ borderColor: T.border, color: T.subtle }}
                >
                  {a}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ActiveTransfers({ extras = [] }) {
  const all = [...ACTIVE_TRANSFERS, ...extras];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4 space-y-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Active transfers
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              {all.length} ongoing · £2,400 drawn this month
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: T.greenLight, color: T.green }}
          >
            On track
          </span>
        </div>
        <Pipeline current="Active" />
      </div>
      {all.map((t) => (
        <TransferRow key={t.id} t={t} />
      ))}
    </div>
  );
}
