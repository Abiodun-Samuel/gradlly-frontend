"use client";
// F1.1.3 — 12-month spend forecast + F1.1.5 export trigger

import { Sparkles } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { AnimatedBar } from "./AnimatedBar";
import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

function Chip({ icon, label, href, onClick, color, bg }) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80 active:scale-95";
  const s = { backgroundColor: bg, color, border: `1px solid ${color}18` };
  if (href)
    return (
      <Link href={href} className={cls} style={s}>
        <span>{icon}</span>
        {label}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls} style={s}>
      <span>{icon}</span>
      {label}
    </button>
  );
}

export function YearEndForecast({ onExport }) {
  const spendPct = Math.round((LEVY.projectedSpend / LEVY.annualPot) * 100);
  const actualPct = Math.round((LEVY.usedThisYear / LEVY.annualPot) * 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <p className="eyebrow">Year-End Forecast</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Projected FY 2024/25 outcome
        </h2>
      </CardHeader>
      <CardContent className="space-y-5 flex-1">
        <div className="space-y-2">
          {[
            {
              label: "Projected annual spend",
              val: LEVY.projectedSpend,
              color: T.blue,
            },
            { label: "Annual levy pot", val: LEVY.annualPot, color: T.muted },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-xs" style={{ color: T.subtle }}>
                {r.label}
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: r.color }}
              >
                {fmt(r.val)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <AnimatedBar pct={actualPct} color={T.blue} height={14} />
          <div className="relative h-3.5">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${spendPct}%`,
                backgroundImage: `repeating-linear-gradient(90deg, ${T.blue}50 0 6px, transparent 6px 10px)`,
              }}
            />
            <div
              className="absolute inset-y-0 rounded-r-full"
              style={{
                left: `${spendPct}%`,
                right: 0,
                backgroundColor: `${T.green}20`,
              }}
            />
          </div>
          <div
            className="flex justify-between text-[10px]"
            style={{ color: T.muted }}
          >
            <span>Actual</span>
            <span>Projected</span>
            <span style={{ color: T.green }}>Surplus</span>
          </div>
        </div>

        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3.5"
          style={{
            backgroundColor: T.greenLight,
            border: `1px solid ${T.green}18`,
          }}
        >
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: T.green }} />
          <div>
            <p className="text-sm font-bold" style={{ color: T.green }}>
              Projected surplus: {fmt(LEVY.projectedSurplus)}
            </p>
            <p className="text-xs" style={{ color: T.green }}>
              Allocate before year-end
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip
            icon="🔁"
            label="Transfer surplus"
            href="/billing"
            color={T.blue}
            bg={T.blueLight}
          />
          <Chip
            icon="➕"
            label="Enrol new starter"
            href="/apprentices"
            color={T.green}
            bg={T.greenLight}
          />
          <Chip
            icon="📤"
            label="Export forecast"
            onClick={onExport}
            color={T.muted}
            bg={T.card}
          />
        </div>
      </CardContent>
    </Card>
  );
}
