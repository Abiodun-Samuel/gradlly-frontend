import { CircleDot, CircleSlash, PenLine } from "lucide-react";

import { cn } from "@/utils/helper";

import { STANDARD_STATUS, STANDARD_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [STANDARD_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [STANDARD_STATUS.ACTIVE]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CircleDot,
  },
  [STANDARD_STATUS.ARCHIVED]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: CircleSlash,
  },
};

export function StandardStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[STANDARD_STATUS.DRAFT];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {STANDARD_STATUS_LABELS[status] ?? status}
    </span>
  );
}
