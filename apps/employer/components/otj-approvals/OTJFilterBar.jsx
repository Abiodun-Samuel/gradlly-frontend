"use client";

import { Search } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const TABS = [
  { key: "submitted", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const sel = {
  backgroundColor: T.surface,
  borderColor: T.border,
  color: T.subtle,
  fontSize: "0.75rem",
};

export function OTJFilterBar({
  tab,
  onTab,
  search,
  onSearch,
  from,
  onFrom,
  to,
  onTo,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="inline-flex rounded-xl overflow-x-auto max-w-full shrink-0"
          style={{ border: `1px solid ${T.border}`, backgroundColor: T.card }}
        >
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onTab(t.key)}
              className="px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0"
              style={{
                backgroundColor: tab === t.key ? T.ink : "transparent",
                color: tab === t.key ? "#fff" : T.subtle,
                borderRight:
                  i < TABS.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          title="From date"
          className="px-3 py-1.5 rounded-xl border text-xs focus:outline-none shrink-0"
          style={sel}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => onTo(e.target.value)}
          title="To date"
          className="px-3 py-1.5 rounded-xl border text-xs focus:outline-none shrink-0"
          style={sel}
        />
      </div>

      <div className="relative">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
          style={{ color: T.muted }}
        />
        <input
          type="text"
          placeholder="Search by note…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none"
          style={{
            backgroundColor: T.surface,
            borderColor: T.border,
            color: T.ink,
          }}
        />
      </div>
    </div>
  );
}
