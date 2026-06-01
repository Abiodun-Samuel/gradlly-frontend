"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

export function SigningAlert({ onSignNow, onViewDoc, onDismiss }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: T.blueLight,
        border: `1px solid ${T.blue}30`,
        borderLeft: `3px solid ${T.blue}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3.5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className="mt-0.5 shrink-0 text-base leading-none"
            style={{ color: T.blue }}
          >
            ℹ
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: T.blue }}>
              Action required — Amara Diallo · CS-003
            </p>
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: T.subtle }}
            >
              WMG Academy (Sunita Patel) has signed on 28 Dec 2023. Amara has
              signed on 27 Dec 2023. Your signature is the final step.
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onSignNow}
                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: T.blue, color: "#fff" }}
              >
                Sign now
              </button>
              <button
                type="button"
                onClick={onViewDoc}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-80 transition-opacity"
                style={{ borderColor: `${T.blue}40`, color: T.blue }}
              >
                View document
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-blue-100 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" style={{ color: T.blue }} />
        </button>
      </div>
    </div>
  );
}
