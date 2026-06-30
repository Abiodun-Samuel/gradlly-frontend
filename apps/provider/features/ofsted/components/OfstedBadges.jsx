import { cn } from "@/utils/helper";

import { EIF_RAG, QIP_STATUS, QIP_STATUS_LABELS } from "../constants";

const RAG_STYLES = {
  [EIF_RAG.RED]: "bg-danger-50 text-danger-600 ring-danger-200",
  [EIF_RAG.AMBER]: "bg-amber-50 text-amber-700 ring-amber-200",
  [EIF_RAG.GREEN]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const RAG_DOT = {
  [EIF_RAG.RED]: "bg-danger-500",
  [EIF_RAG.AMBER]: "bg-amber-500",
  [EIF_RAG.GREEN]: "bg-emerald-500",
};

const RAG_BAR = {
  [EIF_RAG.RED]: "bg-danger-500",
  [EIF_RAG.AMBER]: "bg-amber-500",
  [EIF_RAG.GREEN]: "bg-emerald-500",
};

export function ragStyles(rag) {
  return {
    badge: RAG_STYLES[rag] ?? RAG_STYLES[EIF_RAG.RED],
    dot: RAG_DOT[rag] ?? RAG_DOT[EIF_RAG.RED],
    bar: RAG_BAR[rag] ?? RAG_BAR[EIF_RAG.RED],
  };
}

export function RagBadge({ rag }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        RAG_STYLES[rag] ?? RAG_STYLES[EIF_RAG.RED],
      )}
    >
      <span className={cn("size-1.5 rounded-full", RAG_DOT[rag])} aria-hidden />
      {rag}
    </span>
  );
}

const QIP_STATUS_STYLES = {
  [QIP_STATUS.NOT_STARTED]: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  [QIP_STATUS.IN_PROGRESS]: "bg-sky-50 text-sky-700 ring-sky-200",
  [QIP_STATUS.COMPLETED]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function QipStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        QIP_STATUS_STYLES[status] ?? QIP_STATUS_STYLES[QIP_STATUS.NOT_STARTED],
      )}
    >
      {QIP_STATUS_LABELS[status] ?? status}
    </span>
  );
}
