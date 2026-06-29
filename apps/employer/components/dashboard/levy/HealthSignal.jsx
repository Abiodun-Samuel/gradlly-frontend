"use client";

import { T } from "./tokens";

// Compact single-line signal chip — icon + label + detail all on one row
export function HealthSignal({ icon, label, detail, color, bg, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-left w-full transition-all hover:brightness-95"
      style={{
        backgroundColor: bg,
        border: `1px solid ${color}20`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span className="shrink-0 flex items-center" style={{ color }}>
        {icon}
      </span>
      <span className="text-xs font-bold leading-none" style={{ color }}>
        {label}
      </span>
      <span className="text-xs leading-none" style={{ color: T.subtle }}>
        ·
      </span>
      <span
        className="text-xs leading-none truncate"
        style={{ color: T.subtle }}
      >
        {detail}
      </span>
    </button>
  );
}
