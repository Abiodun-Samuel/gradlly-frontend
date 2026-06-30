import { CheckCircle2, Clock, FileCheck2, PenLine } from "lucide-react";

import { cn } from "@/utils/helper";

import {
  EVIDENCE_STATUS,
  EVIDENCE_STATUS_LABELS,
  KSB_KIND,
  KSB_KIND_LABELS,
} from "../constants";

// ─── KSB kind ────────────────────────────────────────────────────────────────
const KIND_STYLES = {
  [KSB_KIND.KNOWLEDGE]: "bg-blue-50 text-blue-700 ring-blue-200",
  [KSB_KIND.SKILL]: "bg-violet-50 text-violet-700 ring-violet-200",
  [KSB_KIND.BEHAVIOUR]: "bg-teal-50 text-teal-700 ring-teal-200",
};

export function KsbKindBadge({ kind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        KIND_STYLES[kind] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200",
      )}
    >
      {KSB_KIND_LABELS[kind] ?? kind}
    </span>
  );
}

// ─── Evidence status ─────────────────────────────────────────────────────────
const EVIDENCE_STATUS_STYLES = {
  [EVIDENCE_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [EVIDENCE_STATUS.SUBMITTED]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  [EVIDENCE_STATUS.REVIEWED]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: FileCheck2,
  },
  [EVIDENCE_STATUS.ACCEPTED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
};

export function EvidenceStatusBadge({ status }) {
  const style =
    EVIDENCE_STATUS_STYLES[status] ??
    EVIDENCE_STATUS_STYLES[EVIDENCE_STATUS.DRAFT];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {EVIDENCE_STATUS_LABELS[status] ?? status}
    </span>
  );
}
