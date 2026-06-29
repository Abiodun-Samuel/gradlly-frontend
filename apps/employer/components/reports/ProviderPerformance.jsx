"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { PROVIDERS, OTJ_THRESHOLD } from "./data";
import { ProviderDrillPanel } from "./ProviderDrillPanel";

const EXTENDED = PROVIDERS.map((p, i) => ({
  ...p,
  reviewCompliance: [83, 100, 67][i],
  epaPassRate: [100, 50, 75][i],
  withdrawalRate: [0, 5, 0][i],
}));

function metricColor(val, type) {
  if (type === "withdrawal")
    return val === 0 ? T.green : val <= 10 ? T.amber : T.red;
  if (type === "review" || type === "epa")
    return val >= 80 ? T.green : val >= 60 ? T.amber : T.red;
  return T.green;
}

function MetricRow({ label, value, suffix = "%", type }) {
  const color = metricColor(value, type);
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[11px]" style={{ color: T.muted }}>
        {label}
      </span>
      <span className="text-[11px] font-bold" style={{ color }}>
        {value}
        {suffix}
      </span>
    </div>
  );
}

function Bar({ provider, onEscalate, onDrill }) {
  const {
    name,
    pct,
    learners,
    trend,
    belowThreshold,
    reviewCompliance,
    epaPassRate,
    withdrawalRate,
  } = provider;
  const barColor = belowThreshold ? T.amber : T.green;
  const trendUp = trend.startsWith("+");
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <p
            className="text-xs font-semibold truncate"
            style={{ color: T.ink }}
          >
            {name}
          </p>
          {belowThreshold && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: T.amberLight, color: T.amber }}
            >
              Below target
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-semibold"
            style={{ color: trendUp ? T.green : T.red }}
          >
            {trend}
          </span>
          <span
            className="text-sm font-extrabold tabular-nums"
            style={{ color: barColor }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{ backgroundColor: T.border }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-5 opacity-60"
          style={{ left: `${OTJ_THRESHOLD}%`, backgroundColor: T.red }}
          title={`ESFA target: ${OTJ_THRESHOLD}%`}
        />
      </div>
      <div
        className="mt-2 rounded-lg px-3 py-2"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <MetricRow label="OTJ compliance" value={pct} type="otj" />
        <MetricRow
          label="Review compliance"
          value={reviewCompliance}
          type="review"
        />
        <MetricRow label="EPA pass rate" value={epaPassRate} type="epa" />
        <MetricRow
          label="Withdrawal rate"
          value={withdrawalRate}
          type="withdrawal"
        />
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span style={{ color: T.muted }}>
          {learners} learner{learners > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-3">
          {belowThreshold && (
            <button
              type="button"
              onClick={() => onEscalate(provider)}
              className="font-bold hover:underline"
              style={{ color: T.amber }}
            >
              Contact provider →
            </button>
          )}
          <button
            type="button"
            onClick={() => onDrill(provider)}
            className="font-bold hover:underline"
            style={{ color: T.blue }}
          >
            View apprentices →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProviderPerformance({ onEscalate }) {
  const [drill, setDrill] = useState(null);
  const below = EXTENDED.filter((p) => p.belowThreshold).length;
  return (
    <>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
      >
        <div
          className="px-5 py-4 flex items-start justify-between"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Provider performance
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              OTJ · Reviews · EPA · Withdrawals
            </p>
          </div>
          {below > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
              style={{ backgroundColor: T.amberLight, color: T.amber }}
            >
              ⚠ {below} below target
            </span>
          )}
        </div>
        <div className="p-5 space-y-5">
          {EXTENDED.map((p) => (
            <Bar
              key={p.name}
              provider={p}
              onEscalate={onEscalate}
              onDrill={setDrill}
            />
          ))}
          <div
            className="flex items-center gap-2 pt-1"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <div
              className="w-4 h-px rounded opacity-60"
              style={{ backgroundColor: T.red }}
            />
            <p className="text-[10px]" style={{ color: T.muted }}>
              Red line = ESFA minimum: {OTJ_THRESHOLD}% OTJ
            </p>
          </div>
        </div>
      </div>
      {drill && (
        <ProviderDrillPanel
          provider={drill}
          onClose={() => setDrill(null)}
          onContact={onEscalate}
        />
      )}
    </>
  );
}
