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

const COL = ({ children }) => (
  <p
    className="text-[10px] font-bold uppercase tracking-wider"
    style={{ color: T.muted }}
  >
    {children}
  </p>
);

export function CommitmentList({ filter = "all" }) {
  const visible = filterStatements(STATEMENTS, filter);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="flex items-center gap-4 px-5 py-2.5"
        style={{
          backgroundColor: T.card,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div className="w-52 shrink-0">
          <COL>Apprentice</COL>
        </div>
        <div className="hidden lg:block w-24 shrink-0">
          <COL>Start date</COL>
        </div>
        <div className="flex-1 hidden md:block">
          <COL>Signing status</COL>
        </div>
        <div className="ml-auto">
          <COL>Actions</COL>
        </div>
      </div>

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
  );
}
