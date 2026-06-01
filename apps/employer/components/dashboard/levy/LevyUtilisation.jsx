"use client";
// F1.1.3 — Annual utilisation chart: used / expiring / available

import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { AnimatedBar } from "./AnimatedBar";
import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

function Pill({ label, value, color, bg, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="flex flex-col items-center gap-1 rounded-xl py-3 px-2 text-center transition-opacity hover:opacity-80"
      style={{
        backgroundColor: bg,
        border: `1px solid ${color}18`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span className="text-sm font-extrabold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wide"
        style={{ color: T.muted }}
      >
        {label}
      </span>
    </div>
  );
}

export function LevyUtilisation({ onExpiryModal }) {
  const usedPct = Math.round((LEVY.usedThisYear / LEVY.annualPot) * 100);
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Annual Levy Utilisation</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              FY 2024/25 · {fmt(LEVY.annualPot)} total
            </h2>
          </div>
          <span
            className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            {usedPct}% used
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1">
        <AnimatedBar pct={usedPct} color={T.blue} height={12} />
        <div className="grid grid-cols-3 gap-3">
          <Pill label="Used" value="£31.7k" color={T.blue} bg={T.blueLight} />
          <Pill
            label="Expiring"
            value="£12.4k"
            color={T.amber}
            bg={T.amberLight}
            onClick={onExpiryModal}
          />
          <Pill
            label="Available"
            value="£35.8k"
            color={T.green}
            bg={T.greenLight}
          />
        </div>
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: T.blueLight,
            border: `1px solid ${T.blue}18`,
          }}
        >
          <p className="text-xs font-medium" style={{ color: T.blue }}>
            At current rate, you will use <strong>83%</strong> by year end
          </p>
          <AnimatedBar pct={83} color={T.blue} height={8} dashed delay={400} />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: T.subtle }}>
              Projected utilisation
            </span>
            <button
              type="button"
              onClick={onExpiryModal}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              Optimise <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
