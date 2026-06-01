"use client";
import { MoreHorizontal } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

import { TripartiteStatus } from "./TripartiteStatus";

function rowStyle(status) {
  if (status === "pending_employer")
    return { bg: T.amberLight, bl: `3px solid ${T.amber}` };
  if (status === "draft") return { bg: T.card, bl: `3px dashed ${T.border2}` };
  return { bg: T.surface, bl: "3px solid transparent" };
}

export function CommitmentRow({ statement, index }) {
  const {
    id,
    apprentice,
    standard,
    provider,
    startDate,
    status,
    needsRenewal,
    renewalReason,
  } = statement;
  const { bg, bl } = rowStyle(status);

  return (
    <div
      className="transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: bg,
        borderLeft: bl,
        borderBottom: `1px solid ${T.border}`,
        animation: `slide-up 280ms var(--ease-out) ${index * 100}ms both`,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        {/* Apprentice — fixed 200px to match header */}
        <div
          className="shrink-0 flex items-center gap-3"
          style={{ width: 200 }}
        >
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: apprentice.avatarColor }}
          >
            {apprentice.initials}
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: T.ink }}
            >
              {apprentice.name}
            </p>
            <p className="text-[11px] truncate" style={{ color: T.muted }}>
              {standard}
            </p>
            <button
              type="button"
              className="text-[11px] font-medium hover:underline truncate max-w-full block"
              style={{ color: T.blue }}
            >
              {provider}
            </button>
          </div>
        </div>

        {/* Date + version — 120px */}
        <div className="shrink-0" style={{ width: 120 }}>
          <p className="text-[11px] tabular-nums" style={{ color: T.subtle }}>
            {startDate}
          </p>
          <p
            className="text-[9px] uppercase tracking-wider mt-0.5"
            style={{ color: T.muted }}
          >
            {id}
          </p>
          <span
            title={
              statement.version > 1
                ? `Original signed ${statement.originalSignedDate ?? ""} · Renewed ${statement.renewedDate ?? ""}`
                : undefined
            }
            className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block"
            style={{
              backgroundColor: statement.version > 1 ? T.amberLight : T.card,
              color: statement.version > 1 ? T.amber : T.muted,
            }}
          >
            v{statement.version ?? 1}
          </span>
        </div>

        {/* Signing status — flex-1 */}
        <div className="flex-1 min-w-0">
          <TripartiteStatus statement={statement} />
          {needsRenewal && (
            <span
              title={renewalReason}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ backgroundColor: T.amberLight, color: T.amber }}
            >
              🔄 Renewal
            </span>
          )}
        </div>

        {/* Actions — 160px, right-aligned */}
        <div
          className="flex items-center gap-1.5 shrink-0 justify-end"
          style={{ width: 160 }}
        >
          {status === "pending_employer" && (
            <>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ backgroundColor: T.amber, color: "#fff" }}
              >
                Sign now
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ borderColor: T.border2, color: T.subtle }}
              >
                View
              </button>
            </>
          )}
          {status === "draft" && (
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              Complete draft
            </button>
          )}
          {status === "signed" && (
            <>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ backgroundColor: T.blueLight, color: T.blue }}
              >
                View
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 shrink-0"
                style={{ color: T.muted }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
