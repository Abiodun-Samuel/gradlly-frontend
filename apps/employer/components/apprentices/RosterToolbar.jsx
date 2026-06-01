"use client";

import { Download, Plus, Search } from "lucide-react";

import { T } from "./tokens";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "on_track", label: "On track" },
  { key: "at_risk", label: "At risk" },
  { key: "epa_imminent", label: "EPA < 90 days" },
];

const dropdownStyle = {
  backgroundColor: T.surface,
  color: T.subtle,
  borderColor: T.border,
  outline: "none",
  fontSize: "0.75rem",
  fontWeight: 500,
};

export function RosterToolbar({ filter, search, onFilter, onSearch, onEnrol }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2.5">
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

        <div
          className="h-5 w-px shrink-0"
          style={{ backgroundColor: T.border }}
        />

        <select
          className="px-3 py-1.5 rounded-xl border cursor-pointer"
          style={dropdownStyle}
        >
          <option>All providers</option>
          <option>Birmingham Met College</option>
          <option>Aston Training</option>
          <option>WMG Academy</option>
        </select>

        <select
          className="px-3 py-1.5 rounded-xl border cursor-pointer"
          style={dropdownStyle}
        >
          <option>All cohorts</option>
          <option>2023-C</option>
          <option>2024-A</option>
          <option>2024-B</option>
          <option>2024-D</option>
        </select>
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
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl text-xs border w-40 focus:outline-none focus:ring-2 focus:ring-blue-100"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.ink,
            }}
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>

        <button
          type="button"
          onClick={onEnrol}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Plus className="h-3.5 w-3.5" /> Enrol
        </button>
      </div>
    </div>
  );
}
