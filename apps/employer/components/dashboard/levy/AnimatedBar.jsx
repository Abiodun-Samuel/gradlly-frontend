"use client";

import { useEffect, useState } from "react";

import { T } from "./tokens";

export function AnimatedBar({
  pct,
  color,
  height = 10,
  dashed = false,
  delay = 0,
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  const fill = dashed
    ? {
        backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 7px, transparent 7px 11px)`,
      }
    : { backgroundColor: color };

  return (
    <div
      className="relative w-full overflow-hidden rounded-full"
      style={{ height, backgroundColor: T.border2 }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${width}%`,
          transition: "width 950ms cubic-bezier(0.16,1,0.3,1)",
          ...fill,
        }}
      />
    </div>
  );
}
