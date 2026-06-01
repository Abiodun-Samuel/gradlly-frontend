"use client";

import { useEffect, useState } from "react";

import { otjColor } from "./helpers";
import { T } from "./tokens";

export function OtjBar({ actual, expected, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const color = otjColor(actual, expected);

  useEffect(() => {
    const t = setTimeout(() => setWidth(actual), 100 + delay);
    return () => clearTimeout(t);
  }, [actual, delay]);

  return (
    <div className="min-w-[110px]">
      <div
        className="relative h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: T.border2 }}
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 z-10 opacity-50"
          style={{ left: `${expected}%`, backgroundColor: color }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-[900ms] ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-[10px] font-mono tabular-nums" style={{ color }}>
        {actual}% actual · {expected}% expected
      </p>
    </div>
  );
}
