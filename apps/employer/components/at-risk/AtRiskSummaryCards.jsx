"use client";

import { AlertTriangle, CheckCircle2, TrendingUp, Users } from "lucide-react";

import { T } from "./tokens";

function Card({ icon, accent, bg, value, label, sub, badge, pulse, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 ${pulse ? "levy-expiry-pulse" : ""}`}
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
        focusVisibleOutlineColor: accent,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {badge}
      </div>
      <p
        className="text-[26px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
        {label}
      </p>
      {sub && (
        <p className="mt-0.5 text-xs" style={{ color: T.subtle }}>
          {sub}
        </p>
      )}
    </button>
  );
}

/**
 * @param {{
 *   summary: import("./data").AtRiskSummary,
 *   onFilter: (status: string) => void
 * }} props
 */
export function AtRiskSummaryCards({ summary, onFilter }) {
  const { totalActive, atRisk, overdue, recoveredThisMonth } = summary;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        icon={<Users className="h-4 w-4" />}
        accent={T.blue}
        bg={T.blueLight}
        value={totalActive}
        label="Total Active Apprentices"
        sub="Across all providers"
        onClick={() => onFilter("all")}
      />
      <Card
        icon={<AlertTriangle className="h-4 w-4" />}
        accent={T.amber}
        bg={T.amberLight}
        value={atRisk}
        label="At-Risk Apprentices"
        sub="15–30% behind OTJ pace"
        pulse={atRisk > 0}
        badge={
          atRisk > 0 ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full levy-countdown-pulse"
              style={{ backgroundColor: T.amberLight, color: T.amber }}
            >
              OTJ
            </span>
          ) : null
        }
        onClick={() => onFilter("at_risk")}
      />
      <Card
        icon={<TrendingUp className="h-4 w-4" />}
        accent={T.red}
        bg={T.redLight}
        value={overdue}
        label="Overdue Apprentices"
        sub="30%+ behind required pace"
        pulse={overdue > 0}
        badge={
          overdue > 0 ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: T.redLight, color: T.red }}
            >
              ⚠
            </span>
          ) : null
        }
        onClick={() => onFilter("overdue")}
      />
      <Card
        icon={<CheckCircle2 className="h-4 w-4" />}
        accent={T.green}
        bg={T.greenLight}
        value={recoveredThisMonth}
        label="Recovered This Month"
        sub="Back on track"
        onClick={() => onFilter("recovered")}
      />
    </div>
  );
}
