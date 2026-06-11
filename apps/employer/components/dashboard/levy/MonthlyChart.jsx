"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { fmt } from "./helpers";
import { T } from "./tokens";

const CH = 90,
  BW = 22,
  GAP = 11,
  YW = 36;

export function MonthlyChart({ levy }) {
  const bars = useMemo(
    () => levy?.monthlyBreakdown ?? [],
    [levy?.monthlyBreakdown],
  );
  const [heights, setHeights] = useState(() => bars.map(() => 0));
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setHeights(bars.map((b) => b.value ?? 0)), 350);
    return () => clearTimeout(t);
  }, [bars]);

  if (bars.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <p className="eyebrow">Monthly Levy Drawdown</p>
          <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
            Last 8 months
          </h2>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-sm" style={{ color: T.muted }}>
            Monthly breakdown not available
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxVal = Math.max(...bars.map((b) => b.value ?? 0), 1);
  const avg = Math.round(
    bars.reduce((s, b) => s + (b.value ?? 0), 0) / bars.length,
  );
  const totalW = YW + bars.length * (BW + GAP) - GAP + 4;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <p className="eyebrow">Monthly Levy Drawdown</p>
        <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
          Last {bars.length} months
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
            {[0, Math.round(maxVal / 2), maxVal].map((v) => {
              const y = CH - (v / maxVal) * CH;
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
                    {v ? `£${Math.round(v / 1000)}k` : "£0"}
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
              y1={CH - (avg / maxVal) * CH}
              x2={totalW}
              y2={CH - (avg / maxVal) * CH}
              stroke={T.amber}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            {bars.map((bar, i) => {
              const x = YW + i * (BW + GAP);
              const bh = (heights[i] / maxVal) * CH;
              const isH = hovered === i;
              return (
                <g key={bar.month ?? i}>
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
                        {fmt(bar.value ?? 0)}
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
                    {bar.month ?? ""}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs" style={{ color: T.subtle }}>
            Avg: <strong style={{ color: T.ink }}>{fmt(avg)}</strong>
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
