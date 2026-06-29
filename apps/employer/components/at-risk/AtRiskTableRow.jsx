"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ApprenticeAvatar } from "@/components/apprentices/ApprenticeAvatar";

import { AtRiskBadge } from "./AtRiskBadge";
import {
  activityAge,
  activityAgeColor,
  formatPace,
  riskAccent,
} from "./helpers";
import { T } from "./tokens";

function OtjPaceBar({ actual, expected, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const gap = expected - actual;
  const color = gap > 30 ? T.red : gap > 15 ? T.amber : T.green;

  useEffect(() => {
    const t = setTimeout(() => setWidth(actual), 100 + delay);
    return () => clearTimeout(t);
  }, [actual, delay]);

  return (
    <div className="min-w-[110px]">
      <div
        className="relative h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: T.border }}
      >
        <div
          className="absolute top-0 bottom-0 w-0.5 z-10 opacity-60"
          style={{
            left: `${Math.min(expected, 100)}%`,
            backgroundColor: color,
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-[900ms] ease-out"
          style={{ width: `${Math.min(width, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-[10px] font-mono tabular-nums" style={{ color }}>
        {actual}% · req {expected}%
      </p>
    </div>
  );
}

/**
 * @param {{
 *   a: import("./data").AtRiskApprentice,
 *   index: number
 * }} props
 */
export function AtRiskTableRow({ a, index }) {
  const accent = riskAccent(a.risk.status);
  const ageColor = activityAgeColor(a.lastActivity);

  return (
    <tr
      className="transition-all duration-150 hover:bg-neutral-50/80 group"
      style={{
        borderLeft: `3px solid ${accent}`,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {/* Apprentice name — sticky */}
      <td
        className="px-4 py-3"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: T.surface,
          boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
        }}
      >
        <Link
          href={`/at-risk/${a.id}`}
          className="flex items-center gap-2.5 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
        >
          <ApprenticeAvatar initials={a.initials} color={a.avatarColor} />
          <div>
            <p
              className="text-sm font-semibold whitespace-nowrap"
              style={{ color: T.ink }}
            >
              {a.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: T.muted }}>
              {a.employeeId}
            </p>
          </div>
        </Link>
      </td>

      {/* Provider */}
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-xs" style={{ color: T.subtle }}>
          {a.provider}
        </p>
      </td>

      {/* Standard */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs font-medium" style={{ color: T.ink }}>
          {a.standard.replace(/ L\d$/, "")}{" "}
          <span
            className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            {a.standard.match(/L\d/)?.[0] ?? ""}
          </span>
        </p>
      </td>

      {/* Line Manager */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs" style={{ color: T.subtle }}>
          {a.lineManager}
        </p>
      </td>

      {/* OTJ Completion */}
      <td className="px-4 py-3">
        <OtjPaceBar
          actual={a.otjActual}
          expected={a.otjExpected}
          delay={index * 80}
        />
      </td>

      {/* Required OTJ Pace */}
      <td className="px-4 py-3 hidden xl:table-cell">
        <p
          className="text-xs tabular-nums font-medium"
          style={{ color: T.subtle }}
        >
          {formatPace(a.risk.requiredPace)}
        </p>
      </td>

      {/* Actual OTJ Pace */}
      <td className="px-4 py-3 hidden xl:table-cell">
        <p
          className="text-xs tabular-nums font-bold"
          style={{
            color:
              a.risk.paceGap > 30
                ? T.red
                : a.risk.paceGap > 15
                  ? T.amber
                  : T.green,
          }}
        >
          {formatPace(a.risk.actualPace)}
        </p>
      </td>

      {/* Risk Status */}
      <td className="px-4 py-3">
        <AtRiskBadge status={a.risk.status} />
      </td>

      {/* Last Activity */}
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: ageColor }}
          />
          <span className="text-xs tabular-nums" style={{ color: T.subtle }}>
            {activityAge(a.lastActivity)}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/at-risk/${a.id}`}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            View
          </Link>
          <button
            type="button"
            aria-label={`More options for ${a.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: T.muted }}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
}
