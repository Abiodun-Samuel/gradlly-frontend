"use client";
import { Download } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const R = 22,
  C = +(2 * Math.PI * R).toFixed(2),
  PCT = 60;
const FILLED = +((PCT / 100) * C).toFixed(2);

const DOTS = [T.green, T.green, T.amber, T.muted, T.green];
const STATS = [
  { val: "3", label: "Signed", color: T.green },
  { val: "1", label: "Pending", color: T.amber },
  { val: "1", label: "Draft", color: T.muted },
];
const ACTIONS = [
  {
    color: T.red,
    initials: "AD",
    avatarColor: "#b85c0a",
    name: "Amara Diallo",
    id: "CS-003",
    desc: "Awaiting your signature — final step",
    cta: "Sign now",
    ctaBg: T.amber,
  },
  {
    color: T.amber,
    initials: "TG",
    avatarColor: "#1847d4",
    name: "Tom Griffiths",
    id: "CS-004",
    desc: "Draft not sent — apprenticeship non-compliant",
    cta: "Complete draft",
    ctaBg: T.blue,
  },
  {
    color: T.blue,
    initials: "CW",
    avatarColor: "#7c3aed",
    name: "Connor Walsh",
    id: "CS-005",
    desc: "Renewal needed — EPA rescheduled to Jul 2025",
    cta: "Review",
    ctaBg: null,
  },
];

function ActionRow({
  color,
  initials,
  avatarColor,
  name,
  id,
  desc,
  cta,
  ctaBg,
}) {
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
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-xs font-semibold" style={{ color: T.ink }}>
            {name}
          </p>
          <span className="text-[10px] font-mono" style={{ color: T.muted }}>
            {id}
          </span>
        </div>
        <p className="text-[11px] mt-0.5" style={{ color: T.subtle }}>
          {desc}
        </p>
      </div>
      {ctaBg ? (
        <button
          type="button"
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

export function ComplianceBanner() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      {/* ── Score header ─────────────────────────────────── */}
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
              stroke={T.amber}
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
            style={{ color: T.amber }}
          >
            {PCT}%
          </span>
        </div>

        {/* Label + dots */}
        <div className="shrink-0">
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            3 of 5 fully compliant
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            Commitment statements · ESFA
          </p>
          <div className="flex items-center gap-1 mt-2">
            {DOTS.map((d, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: d }}
              />
            ))}
          </div>
        </div>

        <div
          className="h-10 w-px hidden sm:block shrink-0"
          style={{ backgroundColor: T.border }}
        />

        {/* Quick stats */}
        <div className="flex items-center gap-6 flex-1 flex-wrap">
          {STATS.map((s) => (
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

      {/* ── Action rows ───────────────────────────────────── */}
      {ACTIONS.map((a) => (
        <ActionRow key={a.id} {...a} />
      ))}
    </div>
  );
}
