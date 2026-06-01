"use client";
import { Search } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "signed", label: "Signed" },
  { key: "pending", label: "Pending" },
  { key: "draft", label: "Draft" },
  { key: "renewal", label: "Needs renewal" },
];

export function CommitmentToolbar({ filter = "all", onFilter }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div
        className="inline-flex rounded-xl overflow-hidden shrink-0"
        style={{ border: `1px solid ${T.border}`, backgroundColor: T.card }}
      >
        {FILTERS.map((f, i) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilter?.(f.key)}
              className="px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap"
              style={{
                backgroundColor: active ? T.ink : "transparent",
                color: active ? "#fff" : T.subtle,
                borderRight:
                  i < FILTERS.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: T.muted }}
          />
          <input
            type="text"
            placeholder="Search…"
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs border w-44 focus:outline-none"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.ink,
            }}
          />
        </div>
        <select
          className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none"
          style={{
            backgroundColor: T.surface,
            borderColor: T.border,
            color: T.subtle,
          }}
        >
          <option>Sort: Most recent</option>
          <option>Apprentice A–Z</option>
          <option>Status</option>
        </select>
      </div>
    </div>
  );
}
