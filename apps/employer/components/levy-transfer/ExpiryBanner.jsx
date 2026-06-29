"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

import { LEVY } from "./data";

const { expiring, expiryDate, expiryDays } = LEVY;
const fmt = (n) => `£${n.toLocaleString("en-GB")}`;
const chipColor = expiryDays < 30 ? T.red : T.amber;

export function ExpiryBanner({ onDismiss, onFindSME, onLearnMore, onPrefill }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: T.amberLight,
        borderLeft: `4px solid ${T.amber}`,
        border: `1px solid ${T.amber}44`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug"
            style={{ color: T.amber }}
          >
            ⚠ {fmt(expiring)} expiring in{" "}
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mx-1"
              style={{ backgroundColor: `${chipColor}22`, color: chipColor }}
            >
              {expiryDays} days
            </span>
            — transfer to an SME before {expiryDate} to prevent funds returning
            to HMRC
          </p>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <button
              type="button"
              onClick={onFindSME}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.amber, color: "#fff" }}
            >
              Find an SME →
            </button>
            <button
              type="button"
              onClick={onLearnMore}
              className="text-xs font-semibold hover:underline"
              style={{ color: T.amber }}
            >
              Learn more
            </button>
          </div>
          <button
            type="button"
            onClick={onPrefill}
            className="mt-2 text-[11px] font-medium hover:underline block"
            style={{ color: T.amber }}
          >
            Pre-fill with expiring amount ({fmt(expiring)})
          </button>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-amber-100 shrink-0"
          style={{ color: T.amber }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
