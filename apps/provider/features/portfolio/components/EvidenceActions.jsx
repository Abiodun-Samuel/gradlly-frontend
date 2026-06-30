"use client";

import { CheckCircle2, FileCheck2, Undo2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/helper";

import { ReturnEvidenceModal } from "./ReturnEvidenceModal";
import { getEvidenceActions } from "../constants";
import {
  useAcceptEvidence,
  useReviewEvidence,
} from "../queries/portfolio.query";

function ActionButton({
  icon: Icon,
  label,
  onClick,
  loading,
  danger,
  compact,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-50",
        danger
          ? "text-danger-600 hover:bg-danger-50 hover:text-danger-700"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
        {label}
      </span>
    </button>
  );
}

/**
 * Review / accept / return buttons for an evidence item, gated by its status.
 * @param {object}  item
 * @param {boolean} [compact]  hide labels on small screens (table rows)
 */
export function EvidenceActions({ item, compact = false, className }) {
  const review = useReviewEvidence();
  const accept = useAcceptEvidence();
  const [returnOpen, setReturnOpen] = useState(false);

  const actions = getEvidenceActions(item);
  const hasAny = actions.review || actions.accept || actions.return;

  if (!hasAny) {
    return (
      <span className="text-xs text-neutral-300" aria-hidden>
        —
      </span>
    );
  }

  return (
    <>
      <div className={cn("flex items-center justify-end gap-1", className)}>
        {actions.review ? (
          <ActionButton
            icon={FileCheck2}
            label="Review"
            compact={compact}
            loading={review.isPending}
            onClick={() => review.mutate(item.id)}
          />
        ) : null}
        {actions.accept ? (
          <ActionButton
            icon={CheckCircle2}
            label="Accept"
            compact={compact}
            loading={accept.isPending}
            onClick={() => accept.mutate(item.id)}
          />
        ) : null}
        {actions.return ? (
          <ActionButton
            icon={Undo2}
            label="Return"
            danger
            compact={compact}
            onClick={() => setReturnOpen(true)}
          />
        ) : null}
      </div>

      <ReturnEvidenceModal
        item={item}
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
      />
    </>
  );
}
