"use client";
import { Search } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "signed", label: "Signed" },
  { key: "pending", label: "Pending" },
  { key: "draft", label: "Draft" },
  { key: "renewal", label: "Renewal" },
];

const sel = {
  backgroundColor: T.surface,
  borderColor: T.border,
  color: T.subtle,
  fontSize: "0.75rem",
  outline: "none",
};

export function CommitmentToolbar({ filter = "all", onFilter }) {
  return (
    <div className="space-y-2">
      {/* Primary row */}
      <div className="flex items-center gap-2">
        {/* Status filter strip — horizontally scrollable */}
        <div
          className="flex-1 inline-flex rounded-xl overflow-x-auto min-w-0"
          style={{ border: `1px solid ${T.border}`, backgroundColor: T.card }}
        >
          {FILTERS.map((f, i) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onFilter?.(f.key)}
                className="px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0"
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

        {/* Standard filter */}
        <select
          className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none hidden sm:block shrink-0"
          style={sel}
        >
          <option>All standards</option>
          <option>Software Developer L4</option>
          <option>Data Technician L3</option>
          <option>Business Admin L3</option>
          <option>Accounting Technician L4</option>
          <option>HR Support L3</option>
        </select>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: T.muted }}
          />
          <input
            type="text"
            placeholder="Search by apprentice or statement…"
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.ink,
            }}
          />
        </div>
        {/* Standard filter on mobile */}
        <select
          className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none sm:hidden shrink-0"
          style={sel}
        >
          <option>All standards</option>
          <option>Sw Dev L4</option>
          <option>Data Tech L3</option>
          <option>Biz Admin L3</option>
          <option>Acc Tech L4</option>
          <option>HR L3</option>
        </select>
        <select
          className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none shrink-0"
          style={sel}
        >
          <option>Most recent</option>
          <option>A–Z</option>
          <option>Status</option>
        </select>
      </div>
    </div>
  );
}
