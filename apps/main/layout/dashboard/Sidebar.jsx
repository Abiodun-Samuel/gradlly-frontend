"use client";

import { cn } from "@gradlly/utils";
import { X } from "lucide-react";

import { SidebarSection } from "./SidebarSection";

import { progressData, sidebarData, portalMeta } from "@/data/sidebar.data";

/* ─── circular arc progress ──────────────────────────────── */
const R = 17;
const C = 2 * Math.PI * R;

function ArcProgress({ percent }) {
  const offset = C - (percent / 100) * C;
  return (
    <div className="relative size-[52px] shrink-0">
      <svg
        viewBox="0 0 44 44"
        className="size-[52px]"
        aria-hidden="true"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="22"
          cy="22"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r={R}
          fill="none"
          stroke="var(--portal-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 800ms cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-px">
        <span className="text-[12px] font-bold leading-none text-white">
          {percent}
        </span>
        <span className="text-[7px] font-semibold uppercase tracking-wide text-white/40">
          %
        </span>
      </div>
    </div>
  );
}

/* ─── logo area ──────────────────────────────────────────── */
function LogoSection({ onClose }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-between px-5 py-[18px]"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* top shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,rgba(59,130,246,0.55) 45%,rgba(59,130,246,0.15) 100%)",
        }}
      />

      <div className="flex items-center gap-3.5">
        {/* mark */}
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(145deg,rgba(59,130,246,0.42) 0%,rgba(29,78,216,0.2) 100%)",
            border: "1px solid rgba(59,130,246,0.4)",
            boxShadow:
              "0 0 18px rgba(59,130,246,0.2),inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <span className="font-display text-base font-bold text-white">G</span>
        </div>

        {/* wordmark + portal badge */}
        <div className="flex flex-col gap-[5px] leading-none">
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-semibold tracking-tight text-white/90">
              Gradlly
            </span>
            {portalMeta?.name && (
              <span
                className="rounded-md px-[7px] py-[3px] text-[9px] font-bold uppercase tracking-wider text-white/48"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.11)",
                }}
              >
                {portalMeta.name}
              </span>
            )}
          </div>
          {portalMeta?.tagline && (
            <span className="text-[10px] font-medium tracking-wide text-white/26">
              {portalMeta.tagline}
            </span>
          )}
        </div>
      </div>

      <button
        aria-label="Close sidebar"
        data-icon-button
        onClick={onClose}
        className="rounded-lg p-1.5 text-white/28 transition-colors hover:bg-white/6 hover:text-white/55 lg:hidden"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}

/* ─── programme progress card ───────────────────────────── */
function ProgressCard() {
  if (!progressData) return null;
  const { percent, label, subtitle, detail } = progressData;
  return (
    <div
      className="mx-3 mt-3 rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.032)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-3.5">
        <ArcProgress percent={percent} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold leading-snug text-white/84">
            {label}
          </p>
          <p className="mt-1 text-[11px] leading-none text-white/44">
            {subtitle}
          </p>
          <p className="mt-1 text-[10px] leading-none text-white/26">
            {detail}
          </p>
        </div>
      </div>
      <div
        className="mt-3.5 h-[5px] overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background:
              "linear-gradient(90deg,var(--portal-accent) 0%,color-mix(in srgb,var(--portal-accent) 70%,white) 100%)",
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/20">
          Jan 2024
        </span>
        <span className="text-[10px] font-semibold text-white/38">
          {percent}% complete
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/20">
          Jan 2026
        </span>
      </div>
    </div>
  );
}

/* ─── sidebar root ───────────────────────────────────────── */
export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-300 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Sidebar navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-400 flex w-[272px] flex-col",
          "transition-transform duration-300 ease-out",
          "lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: "var(--portal-sidebar-bg)" }}
      >
        <LogoSection onClose={onClose} />
        <ProgressCard />

        {/* scrollable nav */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-4 overflow-y-auto px-3 py-4 [scrollbar-width:none]"
        >
          {sidebarData.map((section) => (
            <SidebarSection key={section.title} section={section} />
          ))}
        </nav>

        {/* footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[10px] text-white/16">v0.1.0</span>
          <span className="text-[10px] text-white/16">© 2026 Gradlly</span>
        </div>
      </aside>
    </>
  );
}
