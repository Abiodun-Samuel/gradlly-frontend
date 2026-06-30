"use client";

import { useEffect, useState } from "react";

import { scoreColor } from "./helpers";
import { T } from "./tokens";

export function HealthRing({ score }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 250);
    return () => clearTimeout(t);
  }, []);

  const r = 40,
    cx = 54,
    cy = 54;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const fill = on ? arc * (score / 100) : 0;
  const color = scoreColor(score);

  return (
    <svg
      width="108"
      height="108"
      viewBox="0 0 108 108"
      style={{ transform: "rotate(135deg)" }}
      aria-hidden
    >
      {/* Track — visible on light backgrounds */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={T.border}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${arc} ${circ}`}
      />
      {/* Score arc */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`}
        style={{
          transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1) 200ms",
          filter: `drop-shadow(0 0 6px ${color}66)`,
        }}
      />
    </svg>
  );
}
