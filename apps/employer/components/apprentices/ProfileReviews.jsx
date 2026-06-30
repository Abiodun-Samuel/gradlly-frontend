import { T } from "./tokens";

const REVIEWS = [
  {
    date: "01 Sep 2024",
    type: "6-month",
    outcome: "Progressing well — all targets met",
    goals:
      "Increase OTJ to 10hrs/week. Complete software architecture module by Dec.",
    actions:
      "Provider to schedule additional day-release. Line manager to confirm work project allocation.",
    signedBy: "Marcus Reid (Tutor) · David Osei (Employer) · 03 Sep 2024",
  },
];

function ReviewCard({ r }) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold" style={{ color: T.ink }}>
            {r.type} review
          </p>
          <p className="text-[11px]" style={{ color: T.muted }}>
            {r.date}
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: T.greenLight, color: T.green }}
        >
          Completed
        </span>
      </div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-1"
          style={{ color: T.muted }}
        >
          Outcome
        </p>
        <p className="text-xs" style={{ color: T.ink }}>
          {r.outcome}
        </p>
      </div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-1"
          style={{ color: T.muted }}
        >
          SMART goals
        </p>
        <p className="text-xs" style={{ color: T.subtle }}>
          {r.goals}
        </p>
      </div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-1"
          style={{ color: T.muted }}
        >
          Action points
        </p>
        <p className="text-xs" style={{ color: T.subtle }}>
          {r.actions}
        </p>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "8px" }}>
        <p className="text-[10px]" style={{ color: T.muted }}>
          Signed by: {r.signedBy}
        </p>
      </div>
      <button
        type="button"
        className="text-xs font-semibold hover:underline"
        style={{ color: T.blue }}
      >
        View full record →
      </button>
    </div>
  );
}

export function ProfileReviews() {
  if (!REVIEWS.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: T.muted }}>
        No reviews recorded yet
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {REVIEWS.map((r, i) => (
        <ReviewCard key={i} r={r} />
      ))}
    </div>
  );
}
