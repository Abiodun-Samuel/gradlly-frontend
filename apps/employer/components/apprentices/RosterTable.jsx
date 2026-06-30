"use client";

import { ArrowUpDown } from "lucide-react";

import { RosterRow } from "./RosterRow";
import { T } from "./tokens";

const TH = ({ children, sortable, sticky, onClick }) => (
  <th
    className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider select-none whitespace-nowrap${sticky ? " bg-[#faf9f7]" : ""}`}
    style={{
      color: T.muted,
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
    onClick={onClick}
  >
    <span className="flex items-center gap-1">
      {children}
      {sortable && <ArrowUpDown className="h-3 w-3 opacity-40" />}
    </span>
  </th>
);

export function RosterTable({ apprentices, filter, onView, onContact }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead
            style={{
              backgroundColor: T.card,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <tr>
              <th
                className="px-4 py-3 w-10"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  backgroundColor: T.card,
                }}
              >
                <input
                  type="checkbox"
                  className="rounded"
                  style={{ accentColor: T.blue }}
                />
              </th>
              <TH sticky sortable>
                Apprentice
              </TH>
              <TH>Standard</TH>
              <TH>Provider</TH>
              <TH sortable>OTJ progress</TH>
              <TH sortable>EPA date</TH>
              <TH sortable>Attendance</TH>
              <TH sortable>Last activity</TH>
              <TH>Status</TH>
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
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-sm"
                  style={{ color: T.muted }}
                >
                  No apprentices match the current filter.
                </td>
              </tr>
            ) : (
              apprentices.map((a, i) => (
                <RosterRow
                  key={a.id}
                  a={a}
                  index={i}
                  onView={onView}
                  onContact={onContact}
                  isFiltered={
                    filter &&
                    filter !== "all" &&
                    a.status !== filter &&
                    !(filter === "epa_imminent" && a.epaDaysLeft < 90)
                  }
                />
              ))
            )}
          </tbody>
          <tfoot>
            <tr
              style={{
                backgroundColor: T.card,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <td
                colSpan={10}
                className="px-5 py-3 text-xs"
                style={{ color: T.muted }}
              >
                {apprentices.length} apprentices · Total committed:{" "}
                <strong style={{ color: T.ink }}>
                  £
                  {apprentices
                    .reduce((s, a) => s + a.levyCost, 0)
                    .toLocaleString("en-GB")}
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
