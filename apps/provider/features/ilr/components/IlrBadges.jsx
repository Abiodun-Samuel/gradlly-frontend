import {
  CheckCircle2,
  Clock,
  Loader2,
  PenLine,
  Send,
  XCircle,
} from "lucide-react";

import { cn } from "@/utils/helper";

import {
  ILR_CONFIG_STATUS,
  ILR_CONFIG_STATUS_LABELS,
  ILR_RECORD_STATUS,
  ILR_RECORD_STATUS_LABELS,
  ILR_SUBMISSION_STATUS,
  ILR_SUBMISSION_STATUS_LABELS,
} from "../constants";

const badge =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset";

// ─── Record status ───────────────────────────────────────────────────────────
const RECORD_STYLES = {
  [ILR_RECORD_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [ILR_RECORD_STATUS.VALIDATED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [ILR_RECORD_STATUS.VALIDATION_FAILED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function IlrRecordStatusBadge({ status }) {
  const style = RECORD_STYLES[status] ?? RECORD_STYLES[ILR_RECORD_STATUS.DRAFT];
  const Icon = style.icon;
  return (
    <span className={cn(badge, style.className)}>
      <Icon className="size-3 shrink-0" aria-hidden />
      {ILR_RECORD_STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Submission status ───────────────────────────────────────────────────────
const SUBMISSION_STYLES = {
  [ILR_SUBMISSION_STATUS.QUEUED]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Clock,
  },
  [ILR_SUBMISSION_STATUS.PROCESSING]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Loader2,
    spin: true,
  },
  [ILR_SUBMISSION_STATUS.SUBMITTED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [ILR_SUBMISSION_STATUS.FAILED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function IlrSubmissionStatusBadge({ status }) {
  const style =
    SUBMISSION_STYLES[status] ??
    SUBMISSION_STYLES[ILR_SUBMISSION_STATUS.QUEUED];
  const Icon = style.icon;
  return (
    <span className={cn(badge, style.className)}>
      <Icon
        className={cn("size-3 shrink-0", style.spin && "animate-spin")}
        aria-hidden
      />
      {ILR_SUBMISSION_STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Config status ───────────────────────────────────────────────────────────
const CONFIG_STYLES = {
  [ILR_CONFIG_STATUS.DRAFT]: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  [ILR_CONFIG_STATUS.PUBLISHED]:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [ILR_CONFIG_STATUS.SUPERSEDED]:
    "bg-violet-50 text-violet-700 ring-violet-200",
};

export function IlrConfigStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        CONFIG_STYLES[status] ?? CONFIG_STYLES[ILR_CONFIG_STATUS.DRAFT],
      )}
    >
      {ILR_CONFIG_STATUS_LABELS[status] ?? status}
      {status === ILR_CONFIG_STATUS.PUBLISHED ? (
        <Send className="ml-1 size-3" aria-hidden />
      ) : null}
    </span>
  );
}

// ─── Validation severity chip ────────────────────────────────────────────────
export function SeverityChip({ severity }) {
  const isError = severity === "error";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
        isError
          ? "bg-danger-50 text-danger-600 ring-danger-200"
          : "bg-amber-50 text-amber-700 ring-amber-200",
      )}
    >
      {severity}
    </span>
  );
}
