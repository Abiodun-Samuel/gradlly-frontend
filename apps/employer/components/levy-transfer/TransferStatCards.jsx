"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { LEVY, ACTIVE_TRANSFERS } from "./data";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;

function StatCard({ value, label, sub, accent, footer, onClick, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
      }}
      onClick={() => {
        setOpen((o) => !o);
        onClick?.();
      }}
    >
      <p
        className="text-[28px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="text-xs font-semibold mt-1" style={{ color: T.ink }}>
        {label}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        {sub}
      </p>
      {footer && <div className="mt-2 text-[11px]">{footer}</div>}
      {open && (
        <div
          className="mt-4 pt-4 space-y-2 text-[11px]"
          style={{
            borderTop: `1px solid ${T.border}`,
            animation: "slide-up 300ms var(--ease-out) both",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function TransferStatCards({ onScrollToFinder }) {
  const { annual, cap50, used, remaining, expiring, expiryDate } = LEVY;
  const usedPct = Math.round((used / cap50) * 100);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        value={fmt(cap50)}
        label="Transfer allowance"
        sub={`50% of annual levy · ${fmt(annual)}`}
        accent={T.ink}
      >
        {[
          ["Annual levy", fmt(annual)],
          ["50% cap", fmt(cap50)],
          ["Already used", `${fmt(used)} (${usedPct}% of allowance)`],
          ["Remaining", `${fmt(remaining)} (${100 - usedPct}% of allowance)`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span style={{ color: T.muted }}>{k}</span>
            <span style={{ color: T.ink }}>{v}</span>
          </div>
        ))}
        <div
          className="flex h-2 rounded-full overflow-hidden mt-1"
          style={{ backgroundColor: T.border }}
        >
          <div
            className="h-full transition-all"
            style={{ width: `${usedPct}%`, backgroundColor: T.ink }}
          />
          <div
            className="h-full flex-1"
            style={{ backgroundColor: `${T.green}44` }}
          />
        </div>
        <p style={{ color: T.muted }}>ESFA policy: 50% cap from April 2025</p>
      </StatCard>

      <StatCard
        value={fmt(used)}
        label="Already transferred"
        sub="2 active transfers · 2 recipients"
        accent={T.green}
        footer={
          <span style={{ color: T.green }}>▲ £2,400 drawn this month</span>
        }
      >
        {ACTIVE_TRANSFERS.map((t) => (
          <div key={t.id} className="flex justify-between">
            <span style={{ color: T.ink }}>{t.recipient}</span>
            <span style={{ color: T.muted }}>
              {fmt(t.drawn)} drawn · Active
            </span>
          </div>
        ))}
        <button
          type="button"
          className="font-semibold hover:underline"
          style={{ color: T.green }}
        >
          View all transfers →
        </button>
      </StatCard>

      <StatCard
        value={fmt(remaining)}
        label="Remaining to transfer"
        sub="Available to SME partners"
        accent={T.amber}
        onClick={onScrollToFinder}
        footer={
          <span style={{ color: T.amber }}>
            ⚠ {fmt(expiring)} expiring {expiryDate}
          </span>
        }
      >
        <div
          className="rounded-lg p-2.5"
          style={{ backgroundColor: T.amberLight }}
        >
          <p className="font-semibold" style={{ color: T.amber }}>
            {fmt(expiring)} expiring {expiryDate}
          </p>
          <p className="mt-0.5" style={{ color: T.amber }}>
            Transfer before this date to prevent HMRC return
          </p>
        </div>
        <p style={{ color: T.muted }}>
          Click to find SME partners in your region
        </p>
      </StatCard>
    </div>
  );
}
