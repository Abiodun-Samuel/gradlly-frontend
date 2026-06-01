import { T } from "./tokens";

const SUMMARY = [
  ["Standard", "Software Developer L4"],
  ["Provider", "Birmingham Met College"],
  ["Start date", "01 Sep 2025"],
  ["Cohort", "2025-A"],
  ["Funding", "£18,000 — levy funded"],
];

const CHECKS = [
  { ok: true, text: "Levy funds available (£35,850 available)" },
  { ok: true, text: "Provider selected" },
  { ok: false, text: "Commitment statement generated after submission" },
];

export function EnrolStep3() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold" style={{ color: T.ink }}>
        Review & submit
      </p>
      <div
        className="rounded-xl px-4 py-3 space-y-2"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        {SUMMARY.map(([l, v]) => (
          <div key={l} className="flex justify-between text-xs">
            <span style={{ color: T.muted }}>{l}</span>
            <span className="font-semibold" style={{ color: T.ink }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl px-4 py-3 space-y-2"
        style={{
          backgroundColor: T.greenLight,
          border: `1px solid ${T.green}20`,
        }}
      >
        {CHECKS.map((c) => (
          <p
            key={c.text}
            className="text-xs font-medium"
            style={{ color: T.ink }}
          >
            {c.ok ? "✅" : "⚠️"} {c.text}
          </p>
        ))}
      </div>
      <p className="text-xs px-1" style={{ color: T.subtle }}>
        This will commit £18,000 from your available levy balance.
      </p>
    </div>
  );
}
