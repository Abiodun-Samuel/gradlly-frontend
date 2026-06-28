"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

const ROI_CARDS = [
  {
    value: "4",
    label: "Total completions",
    sub: "Apprentices who completed to EPA",
    method: "Apprentices who passed EPA in the current FY 2024/25 cohort.",
  },
  {
    value: "£14,250",
    label: "Avg cost per completion",
    sub: "Total levy spend ÷ completions",
    method:
      "Total levy drawn in FY ÷ number of EPA completions. Lower is better.",
  },
  {
    value: "£18,400",
    label: "Est. productivity uplift",
    sub: "Calculated from ONS data per standard",
    method:
      "ONS productivity benchmark per standard × number of completions. Source: ONS Labour Productivity 2024.",
  },
];

function ROICard({ card }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
      onClick={() => setOpen((o) => !o)}
    >
      <p
        className="text-[26px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {card.value}
      </p>
      <p className="text-xs font-semibold mt-1.5" style={{ color: T.ink }}>
        {card.label}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        {card.sub}
      </p>
      <p className="text-[10px] mt-2 font-semibold" style={{ color: T.green }}>
        {open ? "▲ Hide methodology" : "▾ How is this calculated?"}
      </p>
      {open && (
        <p
          className="mt-2 pt-2 text-[11px] leading-relaxed"
          style={{
            color: T.subtle,
            borderTop: `1px solid ${T.border}`,
            animation: "slide-up 200ms ease both",
          }}
        >
          {card.method}
        </p>
      )}
    </div>
  );
}

export function ROICards() {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-3"
        style={{ color: T.muted }}
      >
        ROI breakdown
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ROI_CARDS.map((c) => (
          <ROICard key={c.label} card={c} />
        ))}
      </div>
    </div>
  );
}
