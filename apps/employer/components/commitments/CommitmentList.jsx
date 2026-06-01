"use client";
import { T } from "@/components/dashboard/levy/tokens";

import { CommitmentRow } from "./CommitmentRow";
import { STATEMENTS } from "./data";

function filterStatements(statements, filter) {
  if (filter === "signed")
    return statements.filter((s) => s.status === "signed");
  if (filter === "pending")
    return statements.filter((s) => s.status === "pending_employer");
  if (filter === "draft") return statements.filter((s) => s.status === "draft");
  if (filter === "renewal") return statements.filter((s) => s.needsRenewal);
  return statements;
}

const COL = ({ children, w, right }) => (
  <div
    className={`text-[10px] font-bold uppercase tracking-wider shrink-0${right ? " text-right" : ""}`}
    style={{ color: T.muted, width: w }}
  >
    {children}
  </div>
);

export function CommitmentList({ filter = "all" }) {
  const visible = filterStatements(STATEMENTS, filter);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="overflow-x-auto">
        {/* min-width ensures horizontal scroll kicks in before content crushes */}
        <div style={{ minWidth: 640 }}>
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{
              backgroundColor: T.card,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <COL w={200}>Apprentice</COL>
            <COL w={120}>Start date / version</COL>
            <div
              className="flex-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: T.muted }}
            >
              Signing status
            </div>
            <COL w={160} right>
              Actions
            </COL>
          </div>

          {/* Rows */}
          {visible.map((s, i) => (
            <CommitmentRow key={s.id} statement={s} index={i} />
          ))}

          {visible.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold" style={{ color: T.muted }}>
                No statements match this filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
