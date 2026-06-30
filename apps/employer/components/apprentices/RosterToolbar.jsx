"use client";

import { Filter, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "on_track", label: "On track" },
  { key: "at_risk", label: "At risk" },
  { key: "overdue", label: "Overdue" },
  { key: "epa_ready", label: "EPA Ready" },
];

const EPA_MONTHS = [
  "All EPA months",
  "Jul 2025",
  "Oct 2025",
  "Nov 2025",
  "Jan 2026",
  "Jun 2026",
];
const STANDARDS = [
  "All standards",
  "Software Developer L4",
  "Data Technician L3",
  "Business Admin L3",
  "Accounting Technician L4",
  "HR Support L3",
];
const COHORTS = [
  "All cohorts",
  "Sep 2023 cohort",
  "Jan 2024 cohort",
  "Mar 2024 cohort",
  "Jun 2024 cohort",
  "Sep 2024 cohort",
];

const selStyle = {
  backgroundColor: T.surface,
  color: T.subtle,
  borderColor: T.border,
  fontSize: "0.75rem",
  fontWeight: 500,
  outline: "none",
};

export function RosterToolbar({ filter, search, onFilter, onSearch, onEnrol }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Primary row — always visible */}
      <div className="flex items-center gap-2">
        {/* Status filter pills — scrollable strip */}
        <div
          className="flex-1 inline-flex rounded-xl overflow-x-auto min-w-0"
          style={{
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
            flexShrink: 1,
          }}
        >
          {STATUS_FILTERS.map((f, i) => {
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
                    i < STATUS_FILTERS.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Filters toggle */}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shrink-0 hover:opacity-80 transition-opacity"
          style={{
            borderColor: moreOpen ? T.blue : T.border,
            color: moreOpen ? T.blue : T.subtle,
            backgroundColor: moreOpen ? T.blueLight : T.surface,
          }}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Enrol */}
        <button
          type="button"
          onClick={onEnrol}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity shrink-0"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Enrol</span>
        </button>
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
            placeholder="Search by name, standard, provider or employee ID"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-100"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.ink,
            }}
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity shrink-0"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          ↓ CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity shrink-0"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          ↓ PDF
        </button>
      </div>

      {/* Expanded filters panel */}
      {moreOpen && (
        <div
          className="rounded-xl p-3 flex flex-wrap gap-2 items-center"
          style={{
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            animation: "slide-up 150ms ease both",
          }}
        >
          <select
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            <option>All providers</option>
            <option>Birmingham Met College</option>
            <option>Aston Training</option>
            <option>WMG Academy</option>
          </select>
          <select
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {COHORTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {STANDARDS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {EPA_MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="ml-auto p-1 rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
