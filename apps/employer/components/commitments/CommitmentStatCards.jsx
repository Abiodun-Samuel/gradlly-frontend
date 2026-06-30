"use client";

import { T } from "@/components/dashboard/levy/tokens";

function Card({ value, label, sub, accent, bg, badge, footer, pulse }) {
  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md"
      style={{
        backgroundColor: bg ?? T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
        animation: pulse ? "gl-breathe 2.5s ease-in-out infinite" : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className="text-[28px] font-extrabold tabular-nums leading-none"
          style={{ color: T.ink }}
        >
          {value}
        </p>
        {badge}
      </div>
      <p className="text-xs font-semibold" style={{ color: T.ink }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: T.muted }}>
        {sub}
      </p>
      {footer && <div className="mt-3 text-[11px]">{footer}</div>}
    </div>
  );
}

export function CommitmentStatCards({ statements = [] }) {
  const signed = statements.filter((s) => s.status === "signed");
  const pending = statements.filter((s) => s.status === "pending_employer");
  const drafts = statements.filter((s) => s.status === "draft");

  const firstPending = pending[0];
  const firstDraft = drafts[0];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        value={signed.length}
        label="Fully signed"
        sub="All parties countersigned"
        accent={T.green}
        footer={
          signed.length > 0 ? (
            <span style={{ color: T.green }}>✓ Fully ESFA compliant</span>
          ) : null
        }
      />
      <Card
        value={pending.length}
        label="Pending your signature"
        sub={
          firstPending
            ? `${firstPending.apprentice.name} — awaiting you`
            : "No pending signatures"
        }
        accent={T.amber}
        bg={pending.length > 0 ? T.amberLight : undefined}
        pulse={pending.length > 0}
        badge={
          pending.length > 0 ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${T.amber}22`, color: T.amber }}
            >
              Action
            </span>
          ) : null
        }
        footer={
          pending.length > 0 ? (
            <span style={{ color: T.amber }}>
              {pending.length} statement{pending.length !== 1 ? "s" : ""}{" "}
              awaiting your signature
            </span>
          ) : null
        }
      />
      <Card
        value={drafts.length}
        label="In draft"
        sub={
          firstDraft
            ? `${firstDraft.apprentice.name} — incomplete`
            : "No drafts"
        }
        accent={T.border2}
        bg={T.card}
        footer={
          drafts.length > 0 ? (
            <span style={{ color: T.amber }}>⚠ Non-compliant until signed</span>
          ) : null
        }
      />
    </div>
  );
}
