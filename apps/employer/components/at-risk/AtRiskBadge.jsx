"use client";

import { riskMeta } from "./helpers";

/**
 * @param {{ status: 'on_track' | 'at_risk' | 'overdue', size?: 'sm' | 'md' }} props
 */
export function AtRiskBadge({ status, size = "sm" }) {
  const { label, color, bg } = riskMeta(status);
  const cls = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${cls}`}
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
