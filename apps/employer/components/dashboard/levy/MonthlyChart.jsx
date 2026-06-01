"use client";
// F1.1.3 — Monthly bar chart: contribution vs spend (last 12 months)

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { MONTHLY_BARS } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

const MAX = 4000,
  CH = 90,
  BW = 22,
  GAP = 11,
  YW = 36;
const avg = Math.round(
  MONTHLY_BARS.reduce((s, b) => s + b.value, 0) / MONTHLY_BARS.length,
);
const totalW = YW + MONTHLY_BARS.length * (BW + GAP) - GAP + 4;

export function MonthlyChart() {
  const [heights, setHeights] = useState(MONTHLY_BARS.map(() => 0));
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setTimeout(
      () => setHeights(MONTHLY_BARS.map((b) => b.value)),
      350,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <p className="eyebrow">Monthly Levy Drawdown</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Last 8 months
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between">
        <div className="overflow-x-auto">
          <svg
            width="100%"
            height={CH + 36}
            viewBox={`0 0 ${totalW} ${CH + 36}`}
            preserveAspectRatio="none"
            style={{ display: "block", minWidth: `${totalW}px` }}
          >
            {[0, 2000, 4000].map((v) => {
              const y = CH - (v / MAX) * CH;
              return (
                <g key={v}>
                  <text
                    x={YW - 5}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="9"
                    fill={T.muted}
                    fontFamily="inherit"
                  >
                    {v ? `£${v / 1000}k` : "£0"}
                  </text>
                  <line
                    x1={YW}
                    y1={y}
                    x2={totalW}
                    y2={y}
                    stroke={T.border}
                    strokeWidth="0.5"
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })}
            <line
              x1={YW}
              y1={CH - (avg / MAX) * CH}
              x2={totalW}
              y2={CH - (avg / MAX) * CH}
              stroke={T.amber}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            {MONTHLY_BARS.map((bar, i) => {
              const x = YW + i * (BW + GAP);
              const bh = (heights[i] / MAX) * CH;
              const isH = hovered === i;
              return (
                <g key={bar.month}>
                  <rect
                    x={x}
                    y={CH - bh}
                    width={BW}
                    height={bh}
                    rx="4"
                    fill={isH || bar.current ? T.blue : `${T.blue}55`}
                    style={{
                      transition:
                        "y 950ms cubic-bezier(0.16,1,0.3,1), height 950ms cubic-bezier(0.16,1,0.3,1)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {isH && (
                    <g>
                      <rect
                        x={x - 8}
                        y={CH - bh - 25}
                        width={BW + 16}
                        height={19}
                        rx="5"
                        fill={T.ink}
                      />
                      <text
                        x={x + BW / 2}
                        y={CH - bh - 12}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#fff"
                        fontFamily="inherit"
                        fontWeight="600"
                      >
                        {fmt(bar.value)}
                      </text>
                    </g>
                  )}
                  <text
                    x={x + BW / 2}
                    y={CH + 13}
                    textAnchor="middle"
                    fontSize="9"
                    fill={bar.current ? T.blue : T.muted}
                    fontWeight={bar.current ? "700" : "400"}
                    fontFamily="inherit"
                  >
                    {bar.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs" style={{ color: T.subtle }}>
            Avg: <strong style={{ color: T.ink }}>{fmt(avg)}</strong>
            <span className="ml-2 font-semibold" style={{ color: T.green }}>
              ↑ +12% MoM
            </span>
          </p>
          <Link
            href="/analytics"
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: T.blue }}
          >
            Full history <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
