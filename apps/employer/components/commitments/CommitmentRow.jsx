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
      className="px-5 py-4 transition-all duration-200 cursor-pointer group"
      style={{
        backgroundColor: bg,
        borderLeft: bl,
        borderBottom: `1px solid ${T.border}`,
        animation: `slide-up 280ms var(--ease-out) ${index * 100}ms both`,
      }}
    >
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 w-52 shrink-0">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
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
              className="text-[11px] font-medium hover:underline"
              style={{ color: T.blue }}
            >
              {provider}
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-24 shrink-0">
          <p className="text-[11px] tabular-nums" style={{ color: T.subtle }}>
            {startDate}
          </p>
          <p
            className="text-[9px] uppercase tracking-wider mt-0.5"
            style={{ color: T.muted }}
          >
            {id}
          </p>
        </div>

        <div className="flex-1 hidden md:block">
          <TripartiteStatus statement={statement} />
        </div>

        {needsRenewal && (
          <span
            title={renewalReason}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: T.amberLight, color: T.amber }}
          >
            🔄 Renewal
          </span>
        )}

        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          {status === "pending_employer" && (
            <>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: T.amber, color: "#fff" }}
              >
                Sign now
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80 transition-opacity"
                style={{ borderColor: T.border2, color: T.subtle }}
              >
                View document
              </button>
            </>
          )}
          {status === "draft" && (
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              Complete draft
            </button>
          )}
          {status === "signed" && (
            <>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: T.blueLight, color: T.blue }}
              >
                View document
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
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
