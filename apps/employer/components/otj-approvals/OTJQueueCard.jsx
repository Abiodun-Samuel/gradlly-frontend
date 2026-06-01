"use client";
import { Paperclip } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { CATEGORY_COLOR } from "./data";

function Avatar({ name, color }) {
  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}

export function OTJQueueCard({
  entry,
  selected,
  onSelect,
  onApprove,
  onReject,
  onEvidence,
  index,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [state, setState] = useState("pending"); // pending | approved | rejected

  const approve = () => {
    setState("approved");
    onApprove(entry.id);
  };
  const confirmReject = () => {
    if (reason.trim().length < 10) return;
    setState("rejected");
    setRejecting(false);
    onReject(entry.id, reason);
  };

  const catColor = CATEGORY_COLOR[entry.category] ?? T.muted;
  const isOld = entry.submitted !== "23 Mar 2025"; // simplified old check

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor:
          state === "approved"
            ? "#eaf6f1"
            : state === "rejected"
              ? "#fdecea"
              : T.surface,
        border: `1px solid ${state === "approved" ? T.green : state === "rejected" ? T.red : T.border}`,
        animation: `slide-up 280ms var(--ease-out) ${index * 80}ms both`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-3 p-4 flex-wrap sm:flex-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1 shrink-0"
          style={{ accentColor: "#1847d4" }}
        />
        <Avatar name={entry.apprentice} color={entry.avatarColor} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                {entry.apprentice}
              </p>
              <p className="text-[11px]" style={{ color: T.muted }}>
                {entry.standard}
              </p>
              {entry.atRisk && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                  style={{ backgroundColor: T.amberLight, color: T.amber }}
                >
                  ⚠ At risk · OTJ behind pace
                </span>
              )}
            </div>
            <p
              className="text-[11px] tabular-nums shrink-0"
              style={{ color: isOld ? T.red : T.muted }}
            >
              Submitted {entry.submitted}
            </p>
          </div>
          <p className="text-xs mt-2" style={{ color: T.subtle }}>
            {entry.activity}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              {entry.category}
            </span>
            <span
              className="text-sm font-extrabold tabular-nums"
              style={{ color: "#1847d4" }}
            >
              {entry.hours} hrs
            </span>
            <span className="text-[11px]" style={{ color: T.muted }}>
              {entry.date}
            </span>
            {entry.evidence && (
              <button
                type="button"
                onClick={() => onEvidence(entry)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                style={{ color: T.blue }}
              >
                <Paperclip className="h-3 w-3" /> 1 attachment
              </button>
            )}
          </div>
        </div>

        {state === "pending" && (
          <div className="flex sm:flex-col flex-row gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={approve}
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: T.green, color: "#fff" }}
            >
              ✓ Approve
            </button>
            <button
              type="button"
              onClick={() => setRejecting((r) => !r)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{ borderColor: T.red, color: T.red }}
            >
              ✗ Reject
            </button>
          </div>
        )}
        {state !== "pending" && (
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
            style={{
              backgroundColor: state === "approved" ? T.greenLight : T.redLight,
              color: state === "approved" ? T.green : T.red,
            }}
          >
            {state === "approved" ? "✓ Approved" : "✗ Rejected"}
          </span>
        )}
      </div>

      {rejecting && (
        <div
          className="px-4 pb-4 pt-0 space-y-2"
          style={{
            borderTop: `1px solid ${T.border}`,
            animation: "slide-up 250ms ease-out both",
          }}
        >
          <textarea
            placeholder="Reason for rejection (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none resize-none"
            style={{
              borderColor:
                reason.length < 10 && reason.length > 0 ? T.red : T.border,
              backgroundColor: T.card,
              color: T.ink,
            }}
          />
          <p
            className="text-[10px]"
            style={{ color: reason.length >= 10 ? T.green : T.muted }}
          >
            {reason.length} / 10 minimum
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmReject}
              disabled={reason.trim().length < 10}
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: T.red, color: "#fff" }}
            >
              Confirm rejection
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="text-xs"
              style={{ color: T.muted }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
