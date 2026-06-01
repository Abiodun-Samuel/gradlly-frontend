"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { EXPIRY_MONTHS } from "./data";
import { fmt, urgencyStyle } from "./helpers";
import { T } from "./tokens";

const MAX_AMT = Math.max(...EXPIRY_MONTHS.map((m) => m.amount));

function Dot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-medium" style={{ color: T.muted }}>
        {label}
      </span>
    </div>
  );
}

export function ExpiryTimeline({ onExpiryModal }) {
  const [hovered, setHovered] = useState(null);
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Levy Expiry Schedule</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Next 24 months — Apr 2025 to Mar 2027
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Dot color={T.red} label="Urgent (<60d)" />
            <Dot color={T.amber} label="Warning (60–120d)" />
            <Dot color="#9ca3af" label="Scheduled" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div
            className="flex gap-1.5"
            style={{
              minWidth: 640,
              animation: "levy-slide-in 700ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {EXPIRY_MONTHS.map((m, i) => {
              const s = urgencyStyle(m.urgency);
              const bh =
                m.amount > 0
                  ? Math.max(12, Math.round((m.amount / MAX_AMT) * 60))
                  : 0;
              return (
                <div
                  key={`${m.label}${m.year}`}
                  className="relative flex flex-col items-center gap-1 flex-1 min-w-[28px]"
                >
                  <div
                    className="relative w-full flex flex-col justify-end rounded-lg"
                    style={{
                      height: 68,
                      cursor: m.amount > 0 ? "pointer" : "default",
                    }}
                    onMouseEnter={() => m.amount > 0 && setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => m.amount > 0 && onExpiryModal?.()}
                  >
                    {m.amount > 0 && (
                      <div
                        className={`w-full rounded-lg transition-opacity ${m.urgency === "urgent" ? "levy-expiry-pulse" : ""}`}
                        style={{
                          height: bh,
                          backgroundColor: s?.bg ?? "#e5e7eb",
                          opacity: hovered === i ? 1 : 0.75,
                        }}
                      />
                    )}
                  </div>
                  {hovered === i && m.amount > 0 && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-xl shadow-xl px-3 py-2 pointer-events-none text-xs"
                      style={{
                        backgroundColor: T.ink,
                        color: "#fff",
                        animation: "fade-in 150ms ease both",
                      }}
                    >
                      <p className="font-bold">{fmt(m.amount)}</p>
                      <p style={{ color: "rgba(255,255,255,0.55)" }}>
                        30 {m.label} {m.year}
                      </p>
                    </div>
                  )}
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: m.urgency === "urgent" ? T.red : T.muted }}
                  >
                    {m.label}
                  </span>
                  {i % 3 === 0 && (
                    <span className="text-[8px]" style={{ color: T.border2 }}>
                      {m.year}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
