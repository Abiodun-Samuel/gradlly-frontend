"use client";

import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

const RISK_FILTERS = [
  { key: "needs_attention", label: "Needs Attention" },
  { key: "all", label: "All" },
  { key: "at_risk", label: "At Risk" },
  { key: "overdue", label: "Overdue" },
  { key: "on_track", label: "On Track" },
];

const SORT_OPTIONS = [
  { key: "riskSeverity", label: "Risk Severity" },
  { key: "name", label: "Name" },
  { key: "otj", label: "OTJ %" },
  { key: "lastActivity", label: "Last Activity" },
  { key: "epaDate", label: "EPA Date" },
];

const PROVIDERS = [
  "All Providers",
  "Aston Training",
  "Birmingham Met College",
  "WMG Academy",
];

const STANDARDS = [
  "All Standards",
  "Accounting Technician L4",
  "Customer Service Specialist L3",
  "Data Technician L3",
  "HR Support L3",
  "Operations / Departmental Manager L5",
  "Software Developer L4",
  "Team Leader / Supervisor L3",
];

const LINE_MANAGERS = [
  "All Managers",
  "David Osei",
  "Julie Park",
  "Sarah Rahman",
];

const COHORT_STARTS = [
  "All Cohorts",
  "Sep 2023",
  "Jan 2024",
  "Mar 2024",
  "Apr 2024",
  "Jun 2024",
  "Jul 2024",
  "Sep 2024",
];

const selStyle = {
  backgroundColor: T.surface,
  color: T.subtle,
  borderColor: T.border,
  fontSize: "0.75rem",
  fontWeight: 500,
  outline: "none",
};

/**
 * @param {{
 *   filter: string,
 *   search: string,
 *   sortBy: string,
 *   onFilter: (key: string) => void,
 *   onSearch: (value: string) => void,
 *   onSortBy: (key: string) => void,
 *   filters: { provider: string, standard: string, lineManager: string, cohortStart: string },
 *   onFilterChange: (key: string, value: string) => void
 * }} props
 */
export function AtRiskFilterBar({
  filter,
  search,
  sortBy,
  onFilter,
  onSearch,
  onSortBy,
  filters,
  onFilterChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const activeFilterCount = [
    filters.provider !== "All Providers",
    filters.standard !== "All Standards",
    filters.lineManager !== "All Managers",
    filters.cohortStart !== "All Cohorts",
  ].filter(Boolean).length;

  return (
    <div className="space-y-2">
      {/* Primary row */}
      <div className="flex items-center gap-2">
        {/* Status pills */}
        <div
          className="flex-1 inline-flex rounded-xl overflow-x-auto min-w-0"
          style={{
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
            flexShrink: 1,
          }}
          role="group"
          aria-label="Filter by risk status"
        >
          {RISK_FILTERS.map((f, i) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onFilter(f.key)}
                aria-pressed={active}
                className="px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                style={{
                  backgroundColor: active ? T.ink : "transparent",
                  color: active ? "#fff" : T.subtle,
                  borderRight:
                    i < RISK_FILTERS.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value)}
          aria-label="Sort apprentices by"
          className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer focus:outline-none shrink-0"
          style={selStyle}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              Sort: {o.label}
            </option>
          ))}
        </select>

        {/* More filters toggle */}
        <button
          type="button"
          onClick={() => setExpanded((o) => !o)}
          aria-expanded={expanded}
          aria-controls="at-risk-filters-panel"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: expanded ? T.blue : T.border,
            color: expanded ? T.blue : T.subtle,
            backgroundColor: expanded ? T.blueLight : T.surface,
          }}
        >
          <Filter className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: T.blue }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Search row */}
      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
          style={{ color: T.muted }}
          aria-hidden
        />
        <input
          type="search"
          placeholder="Search by apprentice name or employee ID"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search apprentices"
          className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-100"
          style={{
            backgroundColor: T.surface,
            borderColor: T.border,
            color: T.ink,
          }}
        />
      </div>

      {/* Expanded filters panel */}
      {expanded && (
        <div
          id="at-risk-filters-panel"
          className="rounded-xl p-3 flex flex-wrap gap-2 items-center"
          style={{
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            animation: "slide-up 150ms ease both",
          }}
        >
          <select
            value={filters.provider}
            onChange={(e) => onFilterChange("provider", e.target.value)}
            aria-label="Filter by provider"
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {PROVIDERS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.standard}
            onChange={(e) => onFilterChange("standard", e.target.value)}
            aria-label="Filter by apprenticeship standard"
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {STANDARDS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.lineManager}
            onChange={(e) => onFilterChange("lineManager", e.target.value)}
            aria-label="Filter by line manager"
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {LINE_MANAGERS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={filters.cohortStart}
            onChange={(e) => onFilterChange("cohortStart", e.target.value)}
            aria-label="Filter by cohort start date"
            className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
            style={selStyle}
          >
            {COHORT_STARTS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              onFilterChange("provider", "All Providers");
              onFilterChange("standard", "All Standards");
              onFilterChange("lineManager", "All Managers");
              onFilterChange("cohortStart", "All Cohorts");
            }}
            className="text-xs font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: T.red }}
          >
            Clear all
          </button>

          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="ml-auto p-1 rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
            aria-label="Close filters"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
