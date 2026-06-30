"use client";
import { ArrowRight } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;

function MatchBadge({ score }) {
  const [bg, color] =
    score >= 80
      ? [T.greenLight, T.green]
      : score >= 50
        ? [T.amberLight, T.amber]
        : [T.redLight, T.red];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ backgroundColor: bg, color }}
    >
      {score}% match
    </span>
  );
}

export function SMECard({ sme, onRequestMatch, faded = false }) {
  const {
    emoji,
    name,
    sector,
    location,
    employees,
    standard,
    fundingNeeded,
    matchScore,
    learnfloVerified,
    verificationDetails,
  } = sme;
  const highMatch = matchScore >= 80;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-150"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: highMatch
          ? `3px solid ${T.green}`
          : `1px solid ${T.border}`,
        opacity: faded ? 0.3 : 1,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 3px 14px rgba(0,0,0,0.07)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Icon */}
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl shrink-0"
        style={{ backgroundColor: highMatch ? T.greenLight : T.card }}
      >
        {emoji}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: T.ink }}
          >
            {name}
          </p>
          <MatchBadge score={matchScore} />
          {learnfloVerified ? (
            <span
              title={verificationDetails}
              className="text-[10px] font-semibold cursor-help"
              style={{ color: T.green }}
            >
              ✓ Verified
            </span>
          ) : (
            <span
              className="text-[10px] font-semibold"
              style={{ color: T.amber }}
            >
              ⏳ Pending
            </span>
          )}
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          {sector} · {location} · {employees} employees
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.subtle }}>
          {standard}
        </p>
      </div>

      {/* Right: amount + ghost CTA */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p
          className="text-base font-extrabold tabular-nums"
          style={{ color: T.ink }}
        >
          {fmt(fundingNeeded)}
        </p>
        <p className="text-[10px]" style={{ color: T.muted }}>
          funding needed
        </p>
        <button
          type="button"
          onClick={() => onRequestMatch(sme)}
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
          style={{
            border: `1.5px solid ${T.green}`,
            color: T.green,
            backgroundColor: "transparent",
          }}
        >
          Request transfer
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
