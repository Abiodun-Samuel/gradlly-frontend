import {
  CheckCircle2,
  CircleX,
  Clock,
  Layers,
  PenLine,
  Send,
} from "lucide-react";

import { cn } from "@/utils/helper";

import { COMMITMENT_STATUS, COMMITMENT_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [COMMITMENT_STATUS.DRAFT]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: PenLine,
  },
  [COMMITMENT_STATUS.SUBMITTED]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Send,
  },
  [COMMITMENT_STATUS.AWAITING_SIGNATURES]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock,
  },
  [COMMITMENT_STATUS.SIGNED]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [COMMITMENT_STATUS.SUPERSEDED]: {
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: Layers,
  },
  [COMMITMENT_STATUS.CANCELLED]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: CircleX,
  },
};

export function CommitmentStatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[COMMITMENT_STATUS.DRAFT];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {COMMITMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}
