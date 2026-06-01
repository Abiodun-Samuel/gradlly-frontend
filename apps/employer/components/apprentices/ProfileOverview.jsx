"use client";

import { AlertTriangle, CheckCircle2, Phone } from "lucide-react";

import { attendanceColor } from "./helpers";
import { OtjBar } from "./OtjBar";
import { T } from "./tokens";

const Row = ({ label, value, accent }) => (
  <div className="flex items-start justify-between gap-3 py-1.5">
    <span className="text-xs shrink-0 w-32" style={{ color: T.muted }}>
      {label}
    </span>
    <span
      className="text-xs font-semibold text-right"
      style={{ color: accent ?? T.ink }}
    >
      {value}
    </span>
  </div>
);

export function ProfileOverview({ a, onContact }) {
  const attColor = attendanceColor(a.attendance);
  const attWarn = a.attendance < 85;
  const gap = a.otjActual - a.otjExpected;
  const fmt = (n) => `£${n.toLocaleString("en-GB")}`;

  return (
    <div className="space-y-5">
      {/* Programme details */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Programme
        </p>
        <div
          className="rounded-xl px-4 py-1"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <Row label="Provider" value={a.provider} accent={T.blue} />
          <Row
            label="Assigned tutor"
            value={
              a.tutorName
                ? `${a.tutorName} · ${a.tutorEmail}`
                : a.providerContact.name
            }
          />
          <Row
            label="Line manager"
            value={
              a.lineManager ? `${a.lineManager} · ${a.lineManagerEmail}` : "—"
            }
          />
          <Row label="Start date" value={a.startDate} />
          <Row label="Expected end" value={a.expectedEndDate} />
          <Row
            label="Funding band"
            value={`${fmt(a.fundingBand)} — 100% levy`}
          />
          <div className="flex items-start justify-between gap-3 py-1.5">
            <span className="text-xs w-32 shrink-0" style={{ color: T.muted }}>
              Commitment
            </span>
            <span
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: a.commitmentSigned ? T.green : T.amber }}
            >
              {a.commitmentSigned ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {a.commitmentSigned ? "Signed" : "Awaiting signature"}
            </span>
          </div>
        </div>
      </section>

      {/* OTJ summary */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Off-the-job training
        </p>
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-end gap-6">
            <div>
              <p
                className="text-[28px] font-extrabold tabular-nums leading-none"
                style={{ color: gap < 0 ? T.amber : T.green }}
              >
                {a.otjActual}%
              </p>
              <p className="text-xs mt-1" style={{ color: T.muted }}>
                Actual progress
              </p>
            </div>
            <div>
              <p
                className="text-xl font-bold tabular-nums leading-none"
                style={{ color: T.muted }}
              >
                {a.otjExpected}%
              </p>
              <p className="text-xs mt-1" style={{ color: T.muted }}>
                Expected by now
              </p>
            </div>
            {gap < 0 && (
              <div>
                <p
                  className="text-xl font-bold tabular-nums leading-none"
                  style={{ color: T.red }}
                >
                  {gap}%
                </p>
                <p className="text-xs mt-1" style={{ color: T.muted }}>
                  Gap
                </p>
              </div>
            )}
          </div>
          <OtjBar actual={a.otjActual} expected={a.otjExpected} />
          <p className="text-xs" style={{ color: T.subtle }}>
            {a.otjHoursCompleted} hrs completed of {a.otjHoursRequired} hrs
            required
          </p>
          {gap < 0 && (
            <p className="text-xs font-semibold" style={{ color: T.amber }}>
              ⚠ Current pace: 8 hrs/week · Required pace: 12 hrs/week · Falling
              behind
            </p>
          )}
        </div>
      </section>

      {/* Attendance */}
      <section>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: T.muted }}
        >
          Attendance
        </p>
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: attColor }}
            />
            <span className="text-sm font-bold" style={{ color: attColor }}>
              {a.attendance}%
            </span>
          </div>
          {attWarn && (
            <span className="text-xs font-semibold" style={{ color: T.amber }}>
              Below 85% threshold
            </span>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => onContact?.(a)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold hover:opacity-80 transition-opacity"
          style={{ backgroundColor: T.blueLight, color: T.blue }}
        >
          <Phone className="h-3.5 w-3.5" /> Contact provider
        </button>
        {!a.commitmentSigned && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.amberLight, color: T.amber }}
          >
            Sign commitment statement
          </button>
        )}
      </div>
    </div>
  );
}
