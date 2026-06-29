"use client";

import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

export function OTJBulkToolbar({
  count,
  onApprove,
  onReject,
  onClear,
  isApproving,
  isRejecting,
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  if (count === 0) return null;

  const confirmReject = () => {
    if (reason.trim().length < 10) return;
    onReject(reason);
    setShowReject(false);
    setReason("");
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-2xl rounded-2xl overflow-hidden"
      style={{ animation: "slide-up 300ms ease both" }}
    >
      {showReject ? (
        <div
          className="flex flex-col gap-2 px-5 py-4 w-[min(420px,90vw)]"
          style={{ backgroundColor: T.ink }}
        >
          <span className="text-xs font-bold text-white">
            Reason for rejecting {count} {count === 1 ? "entry" : "entries"}
          </span>
          <textarea
            placeholder="Required (10+ characters)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none resize-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderColor:
                reason.length > 0 && reason.length < 10
                  ? T.red
                  : "rgba(255,255,255,0.2)",
              color: "#fff",
            }}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmReject}
              disabled={reason.trim().length < 10 || isRejecting}
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: T.red, color: "#fff" }}
            >
              {isRejecting ? "Rejecting…" : "Confirm rejection"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReject(false);
                setReason("");
              }}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ backgroundColor: T.ink }}
        >
          <span className="text-xs font-bold text-white">
            {count} {count === 1 ? "entry" : "entries"} selected
          </span>
          <div className="w-px h-4 bg-white/20" />
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: T.green, color: "#fff" }}
          >
            {isApproving ? "Approving…" : "✓ Approve selected"}
          </button>
          <button
            type="button"
            onClick={() => setShowReject(true)}
            disabled={isRejecting}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ borderColor: T.red, color: T.red }}
          >
            ✗ Reject selected
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            Clear ×
          </button>
        </div>
      )}
    </div>
  );
}
