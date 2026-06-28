"use client";
import { useState } from "react";

import { T } from "./tokens";

const MILESTONES = [
  { key: "enrolment", label: "Enrolment", status: "complete" },
  { key: "review6m", label: "6-month review", status: "complete" },
  { key: "review12m", label: "12-month review", status: "upcoming" },
  { key: "gateway", label: "Gateway", status: "upcoming" },
  { key: "mock_epa", label: "Mock EPA", status: "upcoming" },
  { key: "epa", label: "EPA", status: "upcoming" },
];

const NOTES = {
  enrolment: {
    date: "01 Mar 2024",
    notes: "Programme commenced. Commitment statement signed.",
  },
  review6m: {
    date: "01 Sep 2024",
    notes: "6-month review completed. Progressing well. OTJ on pace.",
  },
  review12m: { date: "01 Mar 2025", notes: "Upcoming — not yet completed." },
  gateway: {
    date: "Nov 2025",
    notes: "Gateway review scheduled. Portfolio submission required.",
  },
  mock_epa: { date: "Dec 2025", notes: "Mock EPA booked with EPAO." },
  epa: { date: "Jan 2026", notes: "EPA submission and assessment." },
};

function dot(status) {
  if (status === "complete") return { bg: T.green, border: T.green };
  if (status === "overdue") return { bg: T.red, border: T.red };
  return { bg: "transparent", border: "#1847d4" };
}

export function ProfileTimeline({ a: _a }) {
  const [active, setActive] = useState(null);
  const totalPct = Math.round(
    (MILESTONES.filter((m) => m.status === "complete").length /
      MILESTONES.length) *
      100,
  );

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: T.ink }}>
          Programme progress
        </p>
        <div
          className="relative h-2 rounded-full mb-6 mt-3"
          style={{ backgroundColor: T.border }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${totalPct}%`, backgroundColor: T.green }}
          />
          {MILESTONES.map((m, i) => {
            const pct = Math.round((i / (MILESTONES.length - 1)) * 100);
            const d = dot(m.status);
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActive(active === m.key ? null : m.key)}
                className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 h-4 w-4 rounded-full border-2 transition-transform hover:scale-125"
                style={{
                  left: `${pct}%`,
                  backgroundColor: d.bg,
                  borderColor: d.border,
                }}
                title={m.label}
              />
            );
          })}
        </div>
        <div className="flex justify-between">
          {MILESTONES.map((m) => (
            <span
              key={m.key}
              className="text-[9px] font-semibold text-center"
              style={{ color: T.muted, width: `${100 / MILESTONES.length}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        {active && (
          <div
            className="mt-4 p-3 rounded-lg"
            style={{
              backgroundColor: T.surface,
              border: `1px solid ${T.border}`,
              animation: "slide-up 150ms ease both",
            }}
          >
            <p className="text-xs font-bold" style={{ color: T.ink }}>
              {MILESTONES.find((m) => m.key === active)?.label}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              {NOTES[active]?.date}
            </p>
            <p className="text-xs mt-1.5" style={{ color: T.subtle }}>
              {NOTES[active]?.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
