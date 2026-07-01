import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

import { cn } from "@/utils/helper";

import { PUSH_STATUS, PUSH_STATUS_LABELS } from "../constants";

const STYLES = {
  [PUSH_STATUS.QUEUED]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Clock,
  },
  [PUSH_STATUS.PROCESSING]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Loader2,
    spin: true,
  },
  [PUSH_STATUS.DELIVERED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [PUSH_STATUS.FAILED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function PushStatusBadge({ status }) {
  const style = STYLES[status] ?? STYLES[PUSH_STATUS.FAILED];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon
        className={cn("size-3 shrink-0", style.spin && "animate-spin")}
        aria-hidden
      />
      {PUSH_STATUS_LABELS[status] ?? status}
    </span>
  );
}
