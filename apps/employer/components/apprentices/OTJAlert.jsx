"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

const KEY = "otj_alert_v1";

export function OTJAlert({ atRisk = [], onContact, onViewProfile }) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(KEY) === "1",
  );

  if (dismissed || atRisk.length === 0) return null;

  const dismiss = () => {
    sessionStorage.setItem(KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${T.amber}`,
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: T.amber }}
          />
          <p className="text-xs font-semibold" style={{ color: T.amber }}>
            OTJ alert — {atRisk.length} learner{atRisk.length !== 1 ? "s" : ""}{" "}
            behind expected pace
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-neutral-100 transition-colors shrink-0"
        >
          <X className="h-3 w-3" style={{ color: T.muted }} />
        </button>
      </div>

      {atRisk.map((a, i) => {
        const hasOtj =
          a.otjActual !== null &&
          a.otjActual !== undefined &&
          a.otjExpected !== null &&
          a.otjExpected !== undefined;
        const gap = hasOtj ? a.otjActual - a.otjExpected : null;
        return (
          <div
            key={a.id}
            className="flex items-center gap-4 px-4 py-2.5 flex-wrap sm:flex-nowrap"
            style={{ borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: a.avatarColor }}
              >
                {a.initials}
              </div>
              <p
                className="text-xs font-semibold w-28 truncate"
                style={{ color: T.ink }}
              >
                {a.name}
              </p>
            </div>

            <p
              className="flex-1 text-xs tabular-nums"
              style={{ color: T.muted }}
            >
              {hasOtj ? (
                <>
                  <span className="font-semibold" style={{ color: T.subtle }}>
                    {a.otjActual}%
                  </span>{" "}
                  actual &nbsp;·&nbsp;
                  <span>{a.otjExpected}%</span> expected
                </>
              ) : (
                "OTJ pace: at risk"
              )}
            </p>

            {gap !== null && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums shrink-0"
                style={{ backgroundColor: T.redLight, color: T.red }}
              >
                {gap}%
              </span>
            )}

            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => onContact?.(a)}
                className="text-xs font-semibold hover:underline transition-opacity hover:opacity-80"
                style={{ color: T.blue }}
              >
                Contact provider
              </button>
              <button
                type="button"
                onClick={() => onViewProfile?.(a)}
                className="text-xs font-semibold hover:underline transition-opacity hover:opacity-80"
                style={{ color: T.subtle }}
              >
                View profile
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
