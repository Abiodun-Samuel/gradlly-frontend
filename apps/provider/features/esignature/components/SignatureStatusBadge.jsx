import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { cn } from "@/utils/helper";

import { SIGNATURE_STATUS, SIGNATURE_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [SIGNATURE_STATUS.PENDING]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  [SIGNATURE_STATUS.SIGNED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [SIGNATURE_STATUS.FAILED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: XCircle,
  },
};

export function SignatureStatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] ?? STATUS_STYLES[SIGNATURE_STATUS.PENDING];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {SIGNATURE_STATUS_LABELS[status] ?? status}
    </span>
  );
}
