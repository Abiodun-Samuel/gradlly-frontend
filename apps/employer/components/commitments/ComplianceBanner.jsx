"use client";

import { Download } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const R = 22;
const C = +(2 * Math.PI * R).toFixed(2);

function ActionRow({ statement, onSignNow }) {
  const { apprentice, status } = statement;
  const isPending = status === "pending_employer";
  const isDraft = status === "draft";

  const color = isPending ? T.red : isDraft ? T.amber : T.blue;
  const desc = isPending
    ? "Awaiting your signature — final step"
    : isDraft
      ? "Draft not sent — apprenticeship non-compliant"
      : "Renewal needed";
  const cta = isPending ? "Sign now" : isDraft ? "Complete draft" : "Review";
  const ctaBg = isPending ? T.amber : isDraft ? T.blue : null;

  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5"
      style={{
        borderLeft: `3px solid ${color}`,
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
        style={{ backgroundColor: apprentice.avatarColor }}
      >
        {apprentice.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold" style={{ color: T.ink }}>
            {apprentice.name}
          </p>
          <span className="text-[10px] font-mono" style={{ color: T.muted }}>
            {statement.id.slice(0, 8)}…
          </span>
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: T.subtle }}>
          {desc}
        </p>
      </div>
      {ctaBg ? (
        <button
          type="button"
          onClick={() => isPending && onSignNow?.(statement)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
          style={{ backgroundColor: ctaBg, color: "#fff" }}
        >
          {cta}
        </button>
      ) : (
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0 hover:opacity-75 transition-opacity"
          style={{ borderColor: T.border2, color: T.subtle }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export function ComplianceBanner({ statements = [], onSignNow }) {
  const total = statements.length;
  const signed = statements.filter((s) => s.status === "signed").length;
  const pending = statements.filter(
    (s) => s.status === "pending_employer",
  ).length;
  const drafts = statements.filter((s) => s.status === "draft").length;
  const pct = total === 0 ? 0 : Math.round((signed / total) * 100);

  const FILLED = +((pct / 100) * C).toFixed(2);
  const ringColor = pct === 100 ? T.green : pct >= 60 ? T.amber : T.red;

  // Action rows: pending + draft + renewals (excluding already signed)
  const actionStatements = statements.filter(
    (s) =>
      s.status === "pending_employer" || s.status === "draft" || s.needsRenewal,
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      {/* Score header */}
      <div
        className="flex items-center gap-5 px-5 py-4 flex-wrap"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        {/* Ring */}
        <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
          <svg
            width="64"
            height="64"
            viewBox="0 0 56 56"
            className="absolute inset-0"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="28"
              cy="28"
              r={R}
              fill="none"
              stroke={T.border}
              strokeWidth="5"
            />
            <circle
              cx="28"
              cy="28"
              r={R}
              fill="none"
              stroke={ringColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${FILLED} ${C}`}
              style={{
                transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </svg>
          <span
            className="text-sm font-extrabold tabular-nums"
            style={{ color: ringColor }}
          >
            {pct}%
          </span>
        </div>

        {/* Label */}
        <div className="shrink-0">
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            {signed} of {total} fully compliant
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            Commitment statements · ESFA
          </p>
          {total > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {statements.map((s) => (
                <span
                  key={s.id}
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      s.status === "signed"
                        ? T.green
                        : s.status === "pending_employer"
                          ? T.amber
                          : T.muted,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="h-10 w-px hidden sm:block shrink-0"
          style={{ backgroundColor: T.border }}
        />

        {/* Quick stats */}
        <div className="flex items-center gap-6 flex-1 flex-wrap">
          {[
            { val: signed, label: "Signed", color: T.green },
            { val: pending, label: "Pending", color: T.amber },
            { val: drafts, label: "Draft", color: T.muted },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-2xl font-extrabold tabular-nums leading-none"
                style={{ color: s.color }}
              >
                {s.val}
              </p>
              <p
                className="text-[10px] font-semibold mt-0.5 uppercase tracking-wider"
                style={{ color: T.muted }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border shrink-0 hover:opacity-75 transition-opacity"
          style={{ borderColor: T.border, color: T.subtle }}
        >
          <Download className="h-3.5 w-3.5" /> ESFA audit pack
        </button>
      </div>

      {/* Action rows */}
      {actionStatements.map((s) => (
        <ActionRow key={s.id} statement={s} onSignNow={onSignNow} />
      ))}

      {actionStatements.length === 0 && total > 0 && (
        <div className="px-5 py-4">
          <p className="text-xs font-semibold" style={{ color: T.green }}>
            ✓ All commitment statements are fully signed and compliant.
          </p>
        </div>
      )}
    </div>
  );
}
