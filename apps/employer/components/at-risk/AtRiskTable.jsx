"use client";

import { ArrowUpDown } from "lucide-react";

import { AtRiskTableRow } from "./AtRiskTableRow";
import { T } from "./tokens";

function TH({ children, sortable, sticky, sortKey, sortBy, onSort }) {
  const active = sortBy === sortKey;
  return (
    <th
      className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider select-none whitespace-nowrap${sticky ? " bg-[#faf9f7]" : ""}`}
      style={{
        color: active ? T.blue : T.muted,
        cursor: sortable ? "pointer" : "default",
        ...(sticky
          ? {
              position: "sticky",
              left: 0,
              zIndex: 2,
              backgroundColor: T.card,
              boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
            }
          : {}),
      }}
      onClick={sortable ? () => onSort(sortKey) : undefined}
      aria-sort={active ? "ascending" : sortable ? "none" : undefined}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortable && (
          <ArrowUpDown
            className="h-3 w-3"
            style={{
              opacity: active ? 1 : 0.4,
              color: active ? T.blue : "inherit",
            }}
            aria-hidden
          />
        )}
      </span>
    </th>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <tr>
      <td colSpan={10}>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: T.greenLight }}
          >
            ✓
          </div>
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            {hasSearch ? "No results found" : "No apprentices flagged"}
          </p>
          <p className="text-xs max-w-xs" style={{ color: T.muted }}>
            {hasSearch
              ? "Try adjusting your search or filters."
              : "All apprentices are currently on track with their OTJ requirements."}
          </p>
        </div>
      </td>
    </tr>
  );
}

/**
 * @param {{
 *   apprentices: import("./data").AtRiskApprentice[],
 *   sortBy: string,
 *   onSort: (key: string) => void,
 *   search: string
 * }} props
 */
export function AtRiskTable({ apprentices, sortBy, onSort, search }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full"
          style={{ minWidth: 800 }}
          aria-label="At-risk apprentices"
        >
          <thead
            style={{
              backgroundColor: T.card,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <tr>
              <TH
                sticky
                sortable
                sortKey="name"
                sortBy={sortBy}
                onSort={onSort}
              >
                Apprentice
              </TH>
              <TH>Provider</TH>
              <TH>Standard</TH>
              <TH>Line Manager</TH>
              <TH sortable sortKey="otj" sortBy={sortBy} onSort={onSort}>
                OTJ Completion
              </TH>
              <TH>Required Pace</TH>
              <TH>Actual Pace</TH>
              <TH
                sortable
                sortKey="riskSeverity"
                sortBy={sortBy}
                onSort={onSort}
              >
                Risk Status
              </TH>
              <TH
                sortable
                sortKey="lastActivity"
                sortBy={sortBy}
                onSort={onSort}
              >
                Last Activity
              </TH>
              <th
                className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider"
                style={{ color: T.muted }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {apprentices.length === 0 ? (
              <EmptyState hasSearch={Boolean(search)} />
            ) : (
              apprentices.map((a, i) => (
                <AtRiskTableRow key={a.id} a={a} index={i} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {apprentices.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-3 text-xs"
          style={{ borderTop: `1px solid ${T.border}`, color: T.muted }}
        >
          <span>
            Showing{" "}
            <strong style={{ color: T.ink }}>{apprentices.length}</strong>{" "}
            apprentice{apprentices.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
