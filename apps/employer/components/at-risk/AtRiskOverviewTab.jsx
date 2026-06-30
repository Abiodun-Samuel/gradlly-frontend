"use client";

import { AtRiskBadge } from "./AtRiskBadge";
import { formatPace } from "./helpers";
import { OTJTrendChart } from "./OTJTrendChart";
import { T } from "./tokens";

function InfoRow({ label, value }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2"
      style={{ borderBottom: `1px solid ${T.border}` }}
    >
      <span className="text-xs" style={{ color: T.muted }}>
        {label}
      </span>
      <span
        className="text-xs font-semibold text-right"
        style={{ color: T.ink }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider mb-3"
        style={{ color: T.muted }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

/**
 * @param {{ a: import("./data").AtRiskApprentice }} props
 */
export function AtRiskOverviewTab({ a }) {
  const { risk } = a;
  const otjRemaining = a.otjHoursRequired - a.otjHoursCompleted;
  const completionPct = Math.round(
    (a.otjHoursCompleted / a.otjHoursRequired) * 100,
  );

  return (
    <div className="space-y-4">
      {/* Apprentice Information */}
      <Section title="Apprentice Information">
        <InfoRow label="Employee ID" value={a.employeeId} />
        <InfoRow label="Provider" value={a.provider} />
        <InfoRow label="Apprenticeship Standard" value={a.standard} />
        <InfoRow label="Line Manager" value={a.lineManager} />
        <InfoRow label="Programme Start" value={a.startDate} />
        <InfoRow label="Expected Completion" value={a.expectedEndDate} />
        <InfoRow label="EPA Date" value={a.epaDate} />
      </Section>

      {/* Risk Overview */}
      <Section title="Risk Overview">
        <div className="flex items-center gap-3 mb-3">
          <AtRiskBadge status={risk.status} size="md" />
          {risk.dateFlagged && (
            <span className="text-xs" style={{ color: T.muted }}>
              Flagged {risk.dateFlagged}
            </span>
          )}
        </div>
        <p className="text-xs mb-3" style={{ color: T.subtle }}>
          {risk.reason}
        </p>
        <InfoRow label="Risk Score" value={`${risk.score} / 100`} />
        <InfoRow
          label="OTJ Gap"
          value={`${risk.paceGap > 0 ? risk.paceGap : 0} pp behind`}
        />
        <InfoRow label="Required Pace" value={formatPace(risk.requiredPace)} />
        <InfoRow label="Actual Pace" value={formatPace(risk.actualPace)} />

        {/* Risk score bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px]" style={{ color: T.muted }}>
              Risk level
            </span>
            <span
              className="text-[10px] font-bold"
              style={{
                color:
                  risk.score > 70 ? T.red : risk.score > 40 ? T.amber : T.green,
              }}
            >
              {risk.score > 70 ? "High" : risk.score > 40 ? "Medium" : "Low"}
            </span>
          </div>
          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: T.border }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${risk.score}%`,
                backgroundColor:
                  risk.score > 70 ? T.red : risk.score > 40 ? T.amber : T.green,
                transition: "width 700ms ease-out",
              }}
            />
          </div>
        </div>
      </Section>

      {/* OTJ Analytics */}
      <Section title="OTJ Analytics">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Required", value: `${a.otjHoursRequired}h` },
            {
              label: "Logged",
              value: `${a.otjHoursCompleted}h`,
              highlight: true,
            },
            { label: "Remaining", value: `${otjRemaining}h` },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: T.surface,
                border: `1px solid ${T.border}`,
              }}
            >
              <p
                className="text-base font-extrabold tabular-nums"
                style={{
                  color: highlight
                    ? risk.paceGap > 15
                      ? T.amber
                      : T.green
                    : T.ink,
                }}
              >
                {value}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: T.muted }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Completion bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px]" style={{ color: T.muted }}>
              Overall completion
            </span>
            <span className="text-[10px] font-bold" style={{ color: T.ink }}>
              {completionPct}%
            </span>
          </div>
          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: T.border }}
          >
            <div
              className="absolute top-0 bottom-0 w-0.5 z-10"
              style={{
                left: `${a.otjExpected}%`,
                backgroundColor: T.amber,
                opacity: 0.7,
              }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${a.otjActual}%`,
                backgroundColor:
                  risk.paceGap > 30
                    ? T.red
                    : risk.paceGap > 15
                      ? T.amber
                      : T.green,
                transition: "width 700ms ease-out",
              }}
            />
          </div>
          <p
            className="mt-1 text-[10px] font-mono tabular-nums"
            style={{ color: T.muted }}
          >
            {a.otjActual}% actual · {a.otjExpected}% expected
          </p>
        </div>

        {/* Weekly trend chart */}
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: T.muted }}
          >
            Weekly OTJ Trend (last 8 weeks)
          </p>
          <OTJTrendChart data={a.weeklyOtjTrend} />
        </div>
      </Section>
    </div>
  );
}
