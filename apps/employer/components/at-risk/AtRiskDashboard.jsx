"use client";

import { useMemo, useState } from "react";

import { useAtRiskList } from "@/features/at-risk/queries/at-risk.query";

import { AtRiskAlertBanner } from "./AtRiskAlertBanner";
import { AtRiskFilterBar } from "./AtRiskFilterBar";
import { AtRiskSummaryCards } from "./AtRiskSummaryCards";
import { AtRiskTable } from "./AtRiskTable";
import { T } from "./tokens";

const DEFAULT_FILTERS = {
  provider: "All Providers",
  standard: "All Standards",
  lineManager: "All Managers",
  cohortStart: "All Cohorts",
};

function Skeleton() {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Loading at-risk data"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 animate-pulse"
            style={{
              backgroundColor: T.card,
              border: `1px solid ${T.border}`,
              height: 120,
            }}
          />
        ))}
      </div>
      <div
        className="rounded-2xl animate-pulse"
        style={{
          backgroundColor: T.card,
          border: `1px solid ${T.border}`,
          height: 320,
        }}
      />
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-sm font-bold" style={{ color: T.ink }}>
        Failed to load at-risk data
      </p>
      <p className="text-xs" style={{ color: T.muted }}>
        Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
        style={{ backgroundColor: T.blue, color: "#fff" }}
      >
        Retry
      </button>
    </div>
  );
}

export function AtRiskDashboard() {
  const { data, isLoading, isError, refetch } = useAtRiskList();

  const [filter, setFilter] = useState("needs_attention");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("riskSeverity");
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_FILTERS);

  const handleFilterChange = (key, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const visibleApprentices = useMemo(() => {
    if (!data?.apprentices) return [];

    let list = [...data.apprentices];

    // Status filter
    if (filter === "needs_attention") {
      list = list.filter(
        (a) => a.risk.status === "at_risk" || a.risk.status === "overdue",
      );
    } else if (filter === "at_risk") {
      list = list.filter((a) => a.risk.status === "at_risk");
    } else if (filter === "overdue") {
      list = list.filter((a) => a.risk.status === "overdue");
    } else if (filter === "on_track") {
      list = list.filter((a) => a.risk.status === "on_track");
    }
    // "all" and "recovered" show all

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.employeeId.toLowerCase().includes(q),
      );
    }

    // Advanced filters
    if (advancedFilters.provider !== "All Providers") {
      list = list.filter((a) => a.provider === advancedFilters.provider);
    }
    if (advancedFilters.standard !== "All Standards") {
      list = list.filter((a) =>
        a.standard.includes(advancedFilters.standard.replace(/ L\d$/, "")),
      );
    }
    if (advancedFilters.lineManager !== "All Managers") {
      list = list.filter((a) => a.lineManager === advancedFilters.lineManager);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "otj":
          return a.otjActual - b.otjActual;
        case "lastActivity":
          return a.lastActivity < b.lastActivity ? 1 : -1;
        case "epaDate":
          return a.epaDate < b.epaDate ? -1 : 1;
        case "riskSeverity":
        default: {
          const order = { overdue: 0, at_risk: 1, on_track: 2 };
          const diff =
            (order[a.risk.status] ?? 3) - (order[b.risk.status] ?? 3);
          return diff !== 0 ? diff : b.risk.score - a.risk.score;
        }
      }
    });

    return list;
  }, [data, filter, search, sortBy, advancedFilters]);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const summary = data?.summary ?? {
    totalActive: 0,
    atRisk: 0,
    overdue: 0,
    recoveredThisMonth: 0,
  };

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
          At-Risk Management
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: T.muted }}>
          Monitor and intervene for apprentices falling behind their OTJ
          requirements.
        </p>
      </div>

      <AtRiskAlertBanner
        overdueCount={summary.overdue}
        atRiskCount={summary.atRisk}
      />

      <AtRiskSummaryCards summary={summary} onFilter={setFilter} />

      {filter !== "needs_attention" && filter !== "all" && (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: T.blueLight,
              color: T.blue,
              border: `1px solid ${T.blue}20`,
            }}
          >
            Filtering:{" "}
            {filter === "at_risk"
              ? "At Risk"
              : filter === "overdue"
                ? "Overdue"
                : filter === "on_track"
                  ? "On Track"
                  : "Recovered"}
            <button
              type="button"
              onClick={() => setFilter("needs_attention")}
              className="font-bold hover:opacity-70"
              aria-label="Clear filter"
            >
              ×
            </button>
          </span>
        </div>
      )}

      <AtRiskFilterBar
        filter={filter}
        search={search}
        sortBy={sortBy}
        onFilter={setFilter}
        onSearch={setSearch}
        onSortBy={setSortBy}
        filters={advancedFilters}
        onFilterChange={handleFilterChange}
      />

      <AtRiskTable
        apprentices={visibleApprentices}
        sortBy={sortBy}
        onSort={setSortBy}
        search={search}
      />
    </div>
  );
}
