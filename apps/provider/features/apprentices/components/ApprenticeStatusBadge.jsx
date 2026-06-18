import { cn } from "@/utils/helper";

import { APPRENTICE_STATUS, APPRENTICE_STATUS_LABELS } from "../constants";

const STATUS_STYLES = {
  [APPRENTICE_STATUS.PENDING]:
    "bg-neutral-100 text-neutral-600 ring-neutral-200",
  [APPRENTICE_STATUS.ACTIVE]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [APPRENTICE_STATUS.PAUSED]: "bg-amber-50 text-amber-700 ring-amber-200",
  [APPRENTICE_STATUS.COMPLETED]: "bg-blue-50 text-blue-700 ring-blue-200",
  [APPRENTICE_STATUS.WITHDRAWN]: "bg-danger-50 text-danger-600 ring-danger-200",
};

const DOT_STYLES = {
  [APPRENTICE_STATUS.PENDING]: "bg-neutral-400",
  [APPRENTICE_STATUS.ACTIVE]: "bg-emerald-500",
  [APPRENTICE_STATUS.PAUSED]: "bg-amber-500",
  [APPRENTICE_STATUS.COMPLETED]: "bg-blue-500",
  [APPRENTICE_STATUS.WITHDRAWN]: "bg-danger-500",
};

export function ApprenticeStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STATUS_STYLES[status] ?? STATUS_STYLES[APPRENTICE_STATUS.PENDING],
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          DOT_STYLES[status] ?? DOT_STYLES[APPRENTICE_STATUS.PENDING],
        )}
      />
      {APPRENTICE_STATUS_LABELS[status] ?? status}
    </span>
  );
}
