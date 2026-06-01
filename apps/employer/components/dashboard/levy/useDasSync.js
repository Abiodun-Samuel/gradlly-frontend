"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LEVY } from "./data";
import { fmtAgo } from "./helpers";

const SYNC_INTERVAL_MS = 15 * 60 * 1000; // F1.1.1: auto-sync every 15 min

export function useDasSync() {
  const [syncState, setSyncState] = useState("idle"); // idle | syncing | done | error
  const [lastSynced, setLastSynced] = useState(
    () => new Date(Date.now() - 2 * 60 * 60 * 1000), // seed: 2 hours ago
  );
  const [isDegraded, setIsDegraded] = useState(false);
  const [balance, setBalance] = useState(LEVY.balance);
  const intervalRef = useRef(null);

  const sync = useCallback(() => {
    if (syncState === "syncing") return;
    setSyncState("syncing");
    setTimeout(() => {
      // Simulate API — 95% success for demo
      const ok = Math.random() > 0.05;
      if (ok) {
        setLastSynced(new Date());
        setBalance(LEVY.balance);
        setIsDegraded(false);
        setSyncState("done");
        setTimeout(() => setSyncState("idle"), 2000);
      } else {
        setIsDegraded(true); // F1.1.1: degraded mode
        setSyncState("error");
        setTimeout(() => setSyncState("idle"), 2000);
      }
    }, 1500);
  }, [syncState]);

  // F1.1.1: background auto-sync every 15 minutes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (document.visibilityState !== "hidden") sync();
    }, SYNC_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [sync]);

  return {
    balance,
    syncState,
    isDegraded,
    sync,
    lastSynced,
    fmtLastSynced: () => fmtAgo(lastSynced),
  };
}
