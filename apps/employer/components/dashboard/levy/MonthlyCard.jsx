"use client";

import { ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

export function MonthlyCard() {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      className="h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.green}`,
      }}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: T.greenLight }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: T.green }} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: T.muted }}
          >
            Monthly
          </span>
        </div>
        <p
          className="text-[26px] font-extrabold tabular-nums leading-none"
          style={{ color: T.ink }}
        >
          {fmt(LEVY.monthly)}
        </p>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
          Monthly Contribution
        </p>
        <p className="mt-2 text-xs" style={{ color: T.subtle }}>
          0.5% of {fmt(LEVY.payroll)} payroll
        </p>
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "150px" : "0" }}
      >
        <div
          className="px-5 pb-4 pt-3 space-y-2"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          {[
            ["Jan 2025", 4200],
            ["Feb 2025", 4200],
            ["Mar 2025", 4200],
          ].map(([m, v]) => (
            <div key={m} className="flex justify-between text-xs">
              <span style={{ color: T.subtle }}>{m}</span>
              <span className="font-bold tabular-nums" style={{ color: T.ink }}>
                {fmt(v)}
              </span>
            </div>
          ))}
          <p
            className="pt-2 text-xs"
            style={{ color: T.muted, borderTop: `1px solid ${T.border}` }}
          >
            Next deduction:{" "}
            <strong style={{ color: T.ink }}>19 Apr 2025</strong>
          </p>
          <Link
            href="/billing"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: T.blue }}
          >
            Payroll settings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
