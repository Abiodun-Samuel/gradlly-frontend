"use client";
import { T } from "@/components/dashboard/levy/tokens";

import { PROVIDERS, OTJ_THRESHOLD } from "./data";

function Bar({ provider, onEscalate }) {
  const { name, pct, learners, trend, belowThreshold } = provider;
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
      <div className="flex items-center justify-between text-[10px]">
        <span style={{ color: T.muted }}>
          {learners} learner{learners > 1 ? "s" : ""}
        </span>
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
      </div>
    </div>
  );
}

export function ProviderPerformance({ onEscalate }) {
  const below = PROVIDERS.filter((p) => p.belowThreshold).length;
  return (
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
            OTJ delivery rate · 3 providers
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
        {PROVIDERS.map((p) => (
          <Bar key={p.name} provider={p} onEscalate={onEscalate} />
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
            Red line = ESFA recommended minimum: {OTJ_THRESHOLD}% OTJ delivery
          </p>
        </div>
      </div>
    </div>
  );
}
