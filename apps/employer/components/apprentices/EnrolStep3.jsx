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

const STAGES = [
  { label: "Invited", desc: "Magic-link sent to apprentice" },
  { label: "Account created", desc: "Apprentice registered on Portal 3" },
  { label: "Provider accepted", desc: "Training provider confirmed enrolment" },
  { label: "ILR created", desc: "Provider added to ILR" },
  { label: "DAS confirmed", desc: "ESFA DAS enrolment confirmed" },
];

function StageTracker({ activeStage = 0 }) {
  return (
    <div className="space-y-2">
      <p
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: T.muted }}
      >
        Enrolment stages
      </p>
      {STAGES.map((s, i) => {
        const done = i < activeStage;
        const current = i === activeStage;
        return (
          <div key={s.label} className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: done ? T.green : current ? T.blue : T.border,
                color: done || current ? "#fff" : T.muted,
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            <div>
              <p
                className="text-xs font-semibold"
                style={{ color: current ? T.blue : done ? T.green : T.muted }}
              >
                {s.label}
              </p>
              <p className="text-[11px]" style={{ color: T.muted }}>
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <StageTracker activeStage={0} />
      </div>
      <p className="text-xs px-1" style={{ color: T.subtle }}>
        On submit, a magic-link invitation will be sent to the apprentice&apos;s
        email. Stages will auto-update as each completes.
      </p>
    </div>
  );
}
