import { CheckCircle2, Clock, PenLine, XCircle } from "lucide-react";

import { cn } from "@/utils/helper";

import { OTJ_STATUS, OTJ_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [OTJ_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [OTJ_STATUS.SUBMITTED]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  [OTJ_STATUS.APPROVED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [OTJ_STATUS.REJECTED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function OtjStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[OTJ_STATUS.DRAFT];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {OTJ_STATUS_LABELS[status] ?? status}
    </span>
  );
}
