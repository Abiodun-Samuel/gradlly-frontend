"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { KPI } from "./data";

function KpiCard({ value, label, sub, accent, method, index }) {
  const [open, setOpen] = useState(false);
  const ac = accent();
  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: T.surface,

        animation: `slide-up 280ms var(--ease-out) ${index * 80}ms both`,
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <p
        className="text-[28px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="text-xs font-semibold mt-1.5" style={{ color: T.ink }}>
        {label}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        {sub}
      </p>
      <p className="text-[10px] mt-2 font-semibold" style={{ color: ac }}>
        {open ? "▲ Hide methodology" : "▾ How is this calculated?"}
      </p>
      {open && (
        <p
          className="mt-2 pt-2 text-[11px] leading-relaxed"
          style={{
            color: T.subtle,
            borderTop: `1px solid ${T.border}`,
            animation: "slide-up 200ms var(--ease-out) both",
          }}
        >
          {method}
        </p>
      )}
    </div>
  );
}

export function ReportStatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {KPI.map((k, i) => (
        <KpiCard key={k.label} {...k} index={i} />
      ))}
    </div>
  );
}
