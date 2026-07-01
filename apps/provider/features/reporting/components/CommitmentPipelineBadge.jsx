import { cn } from "@/utils/helper";

import { COMMITMENT_PIPELINE, COMMITMENT_PIPELINE_LABELS } from "../constants";

const STYLES = {
  [COMMITMENT_PIPELINE.NONE]:
    "bg-neutral-100 text-neutral-500 ring-neutral-200",
  [COMMITMENT_PIPELINE.DRAFT]:
    "bg-neutral-100 text-neutral-600 ring-neutral-200",
  [COMMITMENT_PIPELINE.AWAITING_SIGNATURES]:
    "bg-amber-50 text-amber-700 ring-amber-200",
  [COMMITMENT_PIPELINE.SIGNED]:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  [COMMITMENT_PIPELINE.CANCELLED]:
    "bg-danger-50 text-danger-600 ring-danger-200",
};

export function CommitmentPipelineBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STYLES[status] ?? STYLES[COMMITMENT_PIPELINE.NONE],
      )}
    >
      {COMMITMENT_PIPELINE_LABELS[status] ?? status}
    </span>
  );
}
