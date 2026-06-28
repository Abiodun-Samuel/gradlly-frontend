"use client";

import { Check, Loader2, RefreshCw } from "lucide-react";

import { T } from "./tokens";

export function SyncButton({ syncState, onSync }) {
  const syncing = syncState === "syncing";
  const done = syncState === "done";
  const error = syncState === "error";

  const icon = syncing ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
  ) : done ? (
    <Check className="h-3.5 w-3.5" style={{ color: T.green }} />
  ) : error ? (
    <RefreshCw className="h-3.5 w-3.5" style={{ color: T.red }} />
  ) : (
    <RefreshCw className="h-3.5 w-3.5" />
  );

  const label = syncing
    ? "Syncing…"
    : done
      ? "Synced ✓"
      : error
        ? "Retry"
        : "Sync DAS";

  return (
    <button
      type="button"
      onClick={onSync}
      disabled={syncing}
      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
      style={{
        backgroundColor: "#f5f4f2",
        color: T.subtle,
        border: `1px solid ${T.border}`,
      }}
    >
      {icon} {label}
    </button>
  );
}
