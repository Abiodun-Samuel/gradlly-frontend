"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { T } from "./tokens";

const ACTIONS = [
  {
    label: "Allocate expiring funds",
    detail: "Transfer to SME partner",
    href: "/billing",
    color: T.red,
  },
  {
    label: "Enrol 1 new apprentice",
    detail: "Use projected surplus",
    href: "/apprentices",
    color: T.amber,
  },
  {
    label: "Review at-risk OTJ learners",
    detail: "3 learners need attention",
    href: "/apprentices",
    color: T.blue,
  },
];

export function ImprovePanel({ onClose }) {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-[22rem] rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <p
        className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}
      >
        Recommended actions
      </p>
      {ACTIONS.map((a) => (
        <Link
          key={a.label}
          href={a.href}
          onClick={onClose}
          className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50"
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: T.ink }}>
              {a.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {a.detail}
            </p>
          </div>
          <ArrowRight
            className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
            style={{ color: a.color }}
          />
        </Link>
      ))}
    </div>
  );
}
