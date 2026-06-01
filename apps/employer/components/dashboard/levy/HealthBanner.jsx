"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LEVY } from "./data";
import { HealthRing } from "./HealthRing";
import { HealthSignal } from "./HealthSignal";
import { scoreColor, fmt } from "./helpers";
import { ImprovePanel } from "./ImprovePanel";
import { SyncButton } from "./SyncButton";
import { T } from "./tokens";

export function HealthBanner({ das, onExpiryModal, onExport }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const ref = useRef(null);
  const score = LEVY.healthScore;
  const color = scoreColor(score);
  const label = score < 40 ? "Critical" : score < 70 ? "Moderate" : "Healthy";

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPanelOpen(false);
    };
    if (panelOpen) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [panelOpen]);

  return (
    <div
      className="rounded-2xl overflow-visible"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderTop: `3px solid ${color}`,
      }}
    >
      {/* 3-zone horizontal strip */}
      <div
        className="flex flex-col lg:flex-row lg:divide-x"
        style={{ "--tw-divide-opacity": 1 }}
      >
        {/* Zone 1 — Score */}
        <div
          className="flex items-center gap-4 px-5 py-4 shrink-0"
          style={{ borderRight: `1px solid ${T.border}` }}
        >
          <div className="relative shrink-0">
            <HealthRing score={score} />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingTop: 8 }}
            >
              <span
                className="text-[24px] font-extrabold tabular-nums leading-none"
                style={{ color: T.ink }}
              >
                {score}
              </span>
              <span
                className="text-[10px] font-bold tracking-widest"
                style={{ color: T.muted }}
              >
                /100
              </span>
            </div>
          </div>
          <div className="min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                Levy Health
              </p>
              <span
                className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: `${color}12`,
                  color,
                  border: `1px solid ${color}28`,
                }}
              >
                {label}
              </span>
            </div>
            <p className="text-xs" style={{ color: T.muted }}>
              Midlands Engineering Ltd
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              FY 2024/25
            </p>
          </div>
        </div>

        {/* Zone 2 — Signals */}
        <div
          className="flex-1 px-5 py-4 flex flex-col justify-center gap-2"
          style={{ borderRight: `1px solid ${T.border}` }}
        >
          <HealthSignal
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="Utilisation low"
            detail="40% used — 5 months left"
            color={T.amber}
            bg={T.amberLight}
          />
          <HealthSignal
            icon={<AlertCircle className="h-3.5 w-3.5" />}
            label={`${fmt(12400)} expiring`}
            detail="67 days · unallocated"
            color={T.red}
            bg={T.redLight}
            onClick={onExpiryModal}
          />
          <HealthSignal
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="DAS synced"
            detail={das ? das.fmtLastSynced() : "2h ago"}
            color={T.green}
            bg={T.greenLight}
          />
        </div>

        {/* Zone 3 — Actions */}
        <div
          className="flex items-center gap-2 px-5 py-4 shrink-0 flex-wrap"
          ref={ref}
        >
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:opacity-80"
            style={{
              backgroundColor: "#f5f4f2",
              color: T.subtle,
              border: `1px solid ${T.border}`,
            }}
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: T.blueLight,
                color: T.blue,
                border: `1px solid ${T.blue}28`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Improve
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${panelOpen ? "rotate-180" : ""}`}
              />
            </button>
            {panelOpen && <ImprovePanel onClose={() => setPanelOpen(false)} />}
          </div>
          {das && (
            <SyncButton
              syncState={das.syncState}
              onSync={das.sync}
              fmtLastSynced={das.fmtLastSynced}
            />
          )}
        </div>
      </div>
    </div>
  );
}
