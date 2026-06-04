"use client";

import { useEffect, useState } from "react";

import { T } from "./tokens";

const CH = 80;
const BW = 20;
const GAP = 12;
const YW = 28;

/**
 * Pure-SVG weekly OTJ bar chart — follows the MonthlyChart pattern.
 *
 * @param {{ data: import("./data").WeeklyOtjPoint[] }} props
 */
export function OTJTrendChart({ data }) {
  const [animated, setAnimated] = useState(data.map(() => 0));

  const maxHours = Math.max(
    ...data.map((d) => Math.max(d.hours, d.required)),
    1,
  );
  const MAX = Math.ceil(maxHours / 2) * 2 + 2;

  const totalW = YW + data.length * (BW + GAP) - GAP + 4;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(data.map((d) => d.hours)), 200);
    return () => clearTimeout(t);
  }, [data]);

  const yTicks = [0, Math.round(MAX / 2), MAX];

  return (
    <div className="overflow-x-auto">
      <svg
        width="100%"
        height={CH + 36}
        viewBox={`0 0 ${totalW} ${CH + 36}`}
        preserveAspectRatio="none"
        style={{ display: "block", minWidth: `${totalW}px` }}
        role="img"
        aria-label="Weekly OTJ hours trend chart"
      >
        {/* Y-axis gridlines */}
        {yTicks.map((v) => {
          const y = CH - (v / MAX) * CH;
          return (
            <g key={v}>
              <text
                x={YW - 4}
                y={y + 4}
                textAnchor="end"
                fontSize="8"
                fill={T.muted}
                fontFamily="inherit"
              >
                {v}h
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

        {/* Required pace reference line */}
        {data.length > 0 &&
          (() => {
            const reqY = CH - (data[0].required / MAX) * CH;
            return (
              <line
                x1={YW}
                y1={reqY}
                x2={totalW}
                y2={reqY}
                stroke={T.amber}
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            );
          })()}

        {/* Bars */}
        {data.map((d, i) => {
          const x = YW + i * (BW + GAP);
          const animH = (animated[i] / MAX) * CH;
          const actualH = (d.hours / MAX) * CH;
          const gap = d.required - d.hours;
          const barColor = gap > 30 ? T.red : gap > 15 ? T.amber : T.green;

          return (
            <g key={d.week}>
              {/* Bar */}
              <rect
                x={x}
                y={CH - animH}
                width={BW}
                height={animH}
                rx="3"
                fill={barColor}
                opacity="0.85"
                style={{
                  transition: `height 700ms cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms, y 700ms cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`,
                }}
              >
                <title>{`${d.week}: ${d.hours}h (required: ${d.required}h)`}</title>
              </rect>

              {/* Week label */}
              <text
                x={x + BW / 2}
                y={CH + 14}
                textAnchor="middle"
                fontSize="8"
                fill={T.muted}
                fontFamily="inherit"
              >
                {d.week}
              </text>

              {/* Value label on hover via title — show actual value above bar */}
              {d.hours > 0 && (
                <text
                  x={x + BW / 2}
                  y={CH - actualH - 3}
                  textAnchor="middle"
                  fontSize="7"
                  fill={barColor}
                  fontFamily="inherit"
                  fontWeight="bold"
                >
                  {d.hours}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div
            className="h-2 w-4 rounded-sm"
            style={{ backgroundColor: T.green }}
          />
          <span className="text-[10px]" style={{ color: T.muted }}>
            Hours logged
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="8" viewBox="0 0 16 8">
            <line
              x1="0"
              y1="4"
              x2="16"
              y2="4"
              stroke={T.amber}
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>
          <span className="text-[10px]" style={{ color: T.muted }}>
            Required pace
          </span>
        </div>
      </div>
    </div>
  );
}
