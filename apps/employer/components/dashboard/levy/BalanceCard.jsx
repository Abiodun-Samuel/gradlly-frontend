"use client";

import { BarChart3, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

function BreakdownRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs" style={{ color: T.subtle }}>
          {label}
        </span>
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color: T.ink }}>
        {value}
      </span>
    </div>
  );
}

export function BalanceCard({ balance }) {
  const [open, setOpen] = useState(false);
  const bal = balance ?? LEVY.balance;

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      className="h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.blue}`,
      }}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: T.blueLight }}
          >
            <BarChart3 className="h-4 w-4" style={{ color: T.blue }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: T.muted }}
          >
            DAS
          </span>
        </div>
        <p
          className="text-[26px] font-extrabold tabular-nums leading-none"
          style={{ color: T.ink }}
        >
          {fmt(bal)}
        </p>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
          Available Balance
        </p>
        <div
          className="mt-2.5 flex items-center gap-1 text-xs font-semibold"
          style={{ color: T.blue }}
        >
          <TrendingUp className="h-3 w-3" /> DAS synced
        </div>
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "170px" : "0" }}
      >
        <div
          className="px-5 pb-4 pt-3 space-y-2"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <div className="flex h-2 rounded-full overflow-hidden mb-3 gap-0.5">
            <div
              style={{
                width: `${(LEVY.committed / bal) * 100}%`,
                backgroundColor: T.blue,
                borderRadius: "4px 0 0 4px",
              }}
            />
            <div
              style={{
                width: `${(LEVY.expiring / bal) * 100}%`,
                backgroundColor: T.amber,
              }}
            />
            <div
              style={{
                width: `${(LEVY.free / bal) * 100}%`,
                backgroundColor: T.green,
                borderRadius: "0 4px 4px 0",
              }}
            />
          </div>
          <BreakdownRow
            label="Committed"
            value={fmt(LEVY.committed)}
            color={T.blue}
          />
          <BreakdownRow
            label="Expiring"
            value={fmt(LEVY.expiring)}
            color={T.amber}
          />
          <BreakdownRow label="Free" value={fmt(LEVY.free)} color={T.green} />
          <Link
            href="/billing"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: T.blue }}
          >
            Full breakdown <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
