import { CircleCheck, CircleDot, CircleX, PenLine } from "lucide-react";

import { cn } from "@/utils/helper";

import {
  ENROLMENT_STATUS,
  ENROLMENT_STATUS_LABELS,
  EPA_COUNTDOWN_BAND,
  OTJ_PACE_LABELS,
  OTJ_PACE_LEVEL,
  PIPELINE_STATE_LABELS,
} from "../constants";

// ─── Lifecycle status ────────────────────────────────────────────────────────

const STATUS_STYLES = {
  [ENROLMENT_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [ENROLMENT_STATUS.ACTIVE]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CircleDot,
  },
  [ENROLMENT_STATUS.COMPLETED]: {
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: CircleCheck,
  },
  [ENROLMENT_STATUS.CANCELLED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: CircleX,
  },
};

export function EnrolmentStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[ENROLMENT_STATUS.DRAFT];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {ENROLMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Pipeline state ──────────────────────────────────────────────────────────

export function PipelineStateBadge({ state }) {
  if (!state) return <span className="text-neutral-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-100">
      <span aria-hidden className="size-1.5 rounded-full bg-primary-500" />
      {PIPELINE_STATE_LABELS[state] ?? state}
    </span>
  );
}

// ─── EPA countdown band ──────────────────────────────────────────────────────

const BAND_STYLES = {
  [EPA_COUNTDOWN_BAND.GREEN]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [EPA_COUNTDOWN_BAND.AMBER]: "bg-amber-50 text-amber-700 ring-amber-200",
  [EPA_COUNTDOWN_BAND.RED]: "bg-danger-50 text-danger-600 ring-danger-200",
  [EPA_COUNTDOWN_BAND.UNSET]:
    "bg-neutral-100 text-neutral-500 ring-neutral-200",
};

export function EpaCountdownBadge({ band, daysToEpa }) {
  const label =
    band === EPA_COUNTDOWN_BAND.UNSET ||
    daysToEpa === null ||
    daysToEpa === undefined
      ? "EPA date not set"
      : daysToEpa < 0
        ? `EPA ${Math.abs(daysToEpa)}d ago`
        : `${daysToEpa}d to EPA`;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        BAND_STYLES[band] ?? BAND_STYLES[EPA_COUNTDOWN_BAND.UNSET],
      )}
    >
      {label}
    </span>
  );
}

// ─── OTJ pace alert ──────────────────────────────────────────────────────────

const PACE_STYLES = {
  [OTJ_PACE_LEVEL.ON_TRACK]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [OTJ_PACE_LEVEL.AT_RISK]: "bg-amber-50 text-amber-700 ring-amber-200",
  [OTJ_PACE_LEVEL.OFF_TRACK]: "bg-danger-50 text-danger-600 ring-danger-200",
};

export function OtjPaceBadge({ level }) {
  if (!level) return <span className="text-neutral-400">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        PACE_STYLES[level] ??
          "bg-neutral-100 text-neutral-500 ring-neutral-200",
      )}
    >
      {OTJ_PACE_LABELS[level] ?? level}
    </span>
  );
}
