"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

/**
 * @param {{ overdueCount: number, atRiskCount: number }} props
 */
export function AtRiskAlertBanner({ overdueCount, atRiskCount }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (overdueCount === 0 && atRiskCount === 0)) return null;

  const isUrgent = overdueCount > 0;
  const color = isUrgent ? T.red : T.amber;
  const bg = isUrgent ? T.redLight : T.amberLight;

  const message = isUrgent
    ? `${overdueCount} apprentice${overdueCount !== 1 ? "s are" : " is"} overdue${atRiskCount > 0 ? ` and ${atRiskCount} more ${atRiskCount !== 1 ? "are" : "is"} at risk` : ""}. Immediate intervention recommended.`
    : `${atRiskCount} apprentice${atRiskCount !== 1 ? "s are" : " is"} at risk of falling behind their OTJ requirements.`;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: bg, border: `1px solid ${color}20` }}
    >
      <AlertTriangle
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color }}
        aria-hidden
      />
      <p className="flex-1 text-sm font-medium" style={{ color }}>
        {message}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss alert"
        className="shrink-0 rounded hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color }}
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
