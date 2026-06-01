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

export function CommitmentStatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        value={3}
        label="Fully signed"
        sub="All parties countersigned"
        accent={T.green}
        footer={<span style={{ color: T.green }}>✓ Fully ESFA compliant</span>}
      />
      <Card
        value={1}
        label="Pending your signature"
        sub="Amara Diallo — awaiting you"
        accent={T.amber}
        bg={T.amberLight}
        pulse
        badge={
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${T.amber}22`, color: T.amber }}
          >
            90 days
          </span>
        }
        footer={
          <span style={{ color: T.amber }}>
            Apprenticeship started 01 Jan 2024 · 90 days unsigned
          </span>
        }
      />
      <Card
        value={1}
        label="In draft"
        sub="Tom Griffiths — incomplete"
        accent={T.border2}
        bg={T.card}
        footer={
          <span style={{ color: T.amber }}>⚠ Non-compliant until signed</span>
        }
      />
    </div>
  );
}
