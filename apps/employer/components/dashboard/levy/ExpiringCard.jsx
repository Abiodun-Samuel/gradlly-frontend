"use client";

import { Clock } from "lucide-react";

import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

export function ExpiringCard({ onModal }) {
  const days = LEVY.expiringDays;
  const urgent = days < 30;
  const color = urgent ? T.red : T.amber;
  const bg = urgent ? T.redLight : T.amberLight;

  return (
    <div
      onClick={onModal}
      role="button"
      tabIndex={0}
      className="h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md levy-expiry-pulse"
      style={{
        backgroundColor: T.surface,
        border: `1.5px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: bg }}
          >
            <Clock className="h-4 w-4" style={{ color }} />
          </div>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold levy-countdown-pulse"
            style={{ backgroundColor: bg, color }}
          >
            <Clock className="h-3 w-3" /> {days}d left
          </span>
        </div>
        <p
          className="text-[26px] font-extrabold tabular-nums leading-none"
          style={{ color }}
        >
          {fmt(LEVY.expiring)}
        </p>
        <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
          Expiring Within 90 Days
        </p>
        <p className="mt-2 text-xs font-medium" style={{ color }}>
          Jun 2025 · {days} days remaining
        </p>
      </div>
    </div>
  );
}
