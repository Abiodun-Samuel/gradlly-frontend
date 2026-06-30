"use client";
import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

const STEPS = [
  "Programme details",
  "Training plan",
  "Responsibilities",
  "Review & send",
];

function StepDot({ i, current }) {
  const active = i === current,
    done = i < current;
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{
          backgroundColor: active || done ? T.blue : T.card,
          color: active || done ? "#fff" : T.muted,
          border: `2px solid ${active || done ? T.blue : T.border}`,
        }}
      >
        {done ? "✓" : i + 1}
      </div>
      <span
        className="hidden sm:block text-xs font-semibold whitespace-nowrap"
        style={{ color: active ? T.ink : T.muted }}
      >
        {STEPS[i]}
      </span>
    </div>
  );
}

const FIELDS = [
  ["Apprentice", "Tom Griffiths", true],
  ["Standard", "HR Support L3", true],
  ["Provider", "Aston Training", true],
  ["Start date", "01 Sep 2024", true],
  ["Expected end date", "01 Jun 2026", true],
];

export function DraftDrawer({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[230] flex justify-end"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="w-full max-w-[520px] h-full flex flex-col"
        style={{
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms var(--ease-out) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Complete commitment statement
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              Tom Griffiths · HR Support L3 · CS-004
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
          >
            <X className="h-4 w-4" style={{ color: T.muted }} />
          </button>
        </div>

        <div
          className="flex items-center gap-4 px-5 py-3 shrink-0 flex-wrap"
          style={{
            borderBottom: `1px solid ${T.border}`,
            backgroundColor: T.card,
          }}
        >
          {STEPS.map((_, i) => (
            <StepDot key={i} i={i} current={0} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {FIELDS.map(([label, value, readOnly]) => (
            <div key={label}>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                {label}
              </label>
              <input
                type="text"
                defaultValue={value}
                readOnly={readOnly}
                className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
                style={{
                  backgroundColor: readOnly ? T.card : T.surface,
                  borderColor: T.border,
                  color: T.ink,
                }}
              />
            </div>
          ))}
          <div>
            <label
              className="block text-[10px] font-semibold mb-1"
              style={{ color: T.muted }}
            >
              OTJ hours required
            </label>
            <input
              type="number"
              defaultValue={400}
              className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
              style={{
                backgroundColor: T.surface,
                borderColor: T.border,
                color: T.ink,
              }}
            />
            <p className="mt-1 text-[10px]" style={{ color: T.muted }}>
              Based on programme length (400 hours · 20% minimum)
            </p>
          </div>
          <div
            className="rounded-xl p-3 text-xs"
            style={{ backgroundColor: T.amberLight, color: T.amber }}
          >
            ⚠ Apprenticeship may be non-compliant until this commitment
            statement is signed
          </div>
        </div>

        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Save as draft
          </button>
          <button
            type="button"
            className="px-5 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
