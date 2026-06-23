"use client";

import {
  Award,
  CheckCircle2,
  CircleX,
  Handshake,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/helper";

import { EnrolmentActionModal } from "./EnrolmentActionModal";
import { EpaOutcomeModal } from "./EpaOutcomeModal";
import { ENROLMENT_ACTION, getAvailableActions } from "../constants";
import {
  useAcceptProviderEnrolment,
  useActivateEnrolment,
  useCancelEnrolment,
  useCompleteEnrolment,
} from "../queries/enrolments.query";

// ─── Inline action button ────────────────────────────────────────────────────

function ActionButton({ icon: Icon, label, onClick, danger = false, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition-colors duration-150",
        compact ? "px-2 py-1.5" : "px-2.5 py-1.5",
        danger
          ? "text-danger-600 hover:bg-danger-50 hover:text-danger-700"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {/* Hide labels in compact (table) mode to keep rows tight; show on detail. */}
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
        {label}
      </span>
    </button>
  );
}

/**
 * Inline lifecycle action buttons for an enrolment. Renders only the actions
 * valid for the current state (see getAvailableActions) as direct buttons —
 * no dropdown, so nothing is clipped by the table's overflow.
 *
 * @param {object}  enrolment
 * @param {boolean} [compact]  icon-first, labels hidden on small screens (table rows)
 */
export function EnrolmentActionsMenu({
  enrolment,
  compact = false,
  className,
}) {
  // One mutation per no-body action — instantiated unconditionally (rules of hooks).
  const activate = useActivateEnrolment();
  const acceptProvider = useAcceptProviderEnrolment();
  const complete = useCompleteEnrolment();
  const cancel = useCancelEnrolment();

  // `actionModal` holds the no-body action key; `epaOpen` drives the EPA form.
  const [actionModal, setActionModal] = useState(null);
  const [epaOpen, setEpaOpen] = useState(false);

  const available = getAvailableActions(enrolment);
  const id = enrolment?.id;

  const MUTATIONS = {
    [ENROLMENT_ACTION.ACTIVATE]: activate,
    [ENROLMENT_ACTION.ACCEPT_PROVIDER]: acceptProvider,
    [ENROLMENT_ACTION.COMPLETE]: complete,
    [ENROLMENT_ACTION.CANCEL]: cancel,
  };

  const hasAny =
    available.activate ||
    available.acceptProvider ||
    available.complete ||
    available.recordEpa ||
    available.cancel;

  if (!hasAny) {
    return (
      <span className="text-xs text-neutral-300" aria-hidden>
        —
      </span>
    );
  }

  return (
    <>
      <div className={cn("flex items-center gap-1", className)}>
        {available.activate ? (
          <ActionButton
            icon={PlayCircle}
            label="Activate"
            compact={compact}
            onClick={() => setActionModal(ENROLMENT_ACTION.ACTIVATE)}
          />
        ) : null}

        {available.acceptProvider ? (
          <ActionButton
            icon={Handshake}
            label="Accept"
            compact={compact}
            onClick={() => setActionModal(ENROLMENT_ACTION.ACCEPT_PROVIDER)}
          />
        ) : null}

        {available.complete ? (
          <ActionButton
            icon={CheckCircle2}
            label="Complete"
            compact={compact}
            onClick={() => setActionModal(ENROLMENT_ACTION.COMPLETE)}
          />
        ) : null}

        {available.recordEpa ? (
          <ActionButton
            icon={Award}
            label="Record EPA"
            compact={compact}
            onClick={() => setEpaOpen(true)}
          />
        ) : null}

        {available.cancel ? (
          <ActionButton
            icon={CircleX}
            label="Cancel"
            danger
            compact={compact}
            onClick={() => setActionModal(ENROLMENT_ACTION.CANCEL)}
          />
        ) : null}
      </div>

      <EnrolmentActionModal
        action={actionModal}
        enrolmentId={id}
        open={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        mutation={actionModal ? MUTATIONS[actionModal] : null}
      />

      <EpaOutcomeModal
        enrolmentId={id}
        open={epaOpen}
        onClose={() => setEpaOpen(false)}
      />
    </>
  );
}
