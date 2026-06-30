import {
  CalendarClock,
  CheckCircle2,
  Clock,
  PenLine,
  XCircle,
} from "lucide-react";

import { cn } from "@/utils/helper";

import { REVIEW_STATUS, REVIEW_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [REVIEW_STATUS.SCHEDULED]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: CalendarClock,
  },
  [REVIEW_STATUS.IN_PROGRESS]: {
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: PenLine,
  },
  [REVIEW_STATUS.AWAITING_SIGNATURES]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  [REVIEW_STATUS.COMPLETED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [REVIEW_STATUS.CANCELLED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function ReviewStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[REVIEW_STATUS.SCHEDULED];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {REVIEW_STATUS_LABELS[status] ?? status}
    </span>
  );
}

// Overdue badge + days-until chip. Hidden for terminal reviews.
export function ReviewDueChip({ review }) {
  if (
    review?.status === REVIEW_STATUS.COMPLETED ||
    review?.status === REVIEW_STATUS.CANCELLED
  ) {
    return null;
  }

  if (review?.isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 px-2 py-0.5 text-xs font-semibold text-danger-600 ring-1 ring-inset ring-danger-200">
        Overdue
      </span>
    );
  }

  const days = review?.daysUntilDue;
  if (days === null || days === undefined) return null;

  const label =
    days === 0
      ? "Due today"
      : days > 0
        ? `In ${days} day${days === 1 ? "" : "s"}`
        : `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        days < 0
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-neutral-50 text-neutral-600 ring-neutral-200",
      )}
    >
      {label}
    </span>
  );
}
