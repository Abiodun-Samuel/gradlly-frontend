"use client";
// F1.1.2 — Levy Expiry & Funds at Risk Alert
// Amber if < 90 days · Red if < 30 days · Dismissible per session

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LEVY } from "./data";
import { fmt } from "./helpers";
import { T } from "./tokens";

const SESSION_KEY = "levy_expiry_alert_v1";

export function ExpiryAlert() {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );
  const days = LEVY.expiringDays;

  if (dismissed || days > 90) return null;

  const urgent = days < 30;
  const color = urgent ? T.red : T.amber;
  const bg = urgent ? T.redLight : T.amberLight;

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3.5 justify-between"
      style={{ backgroundColor: bg, border: `1.5px solid ${color}30` }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-lg mt-px shrink-0">{urgent ? "🔴" : "⚠️"}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color }}>
            {urgent ? "Urgent" : "Warning"}: {fmt(LEVY.expiring)} expires in{" "}
            {days} days
          </p>
          <p className="text-xs mt-0.5" style={{ color: T.subtle }}>
            Jun 2025 allocation — allocate before expiry to protect your levy
            investment.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        <Link
          href="/billing"
          onClick={dismiss}
          className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
          style={{ backgroundColor: color, color: "#fff" }}
        >
          Take action →
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-3 w-3" style={{ color }} />
        </button>
      </div>
    </div>
  );
}
