"use client";

import { CheckCircle2, CircleX, Handshake, PlayCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { ENROLMENT_ACTION } from "../constants";

// Per-action presentation + which mutation hook result drives it. The caller
// passes the already-instantiated mutation so hooks are never called
// conditionally here.
const ACTION_META = {
  [ENROLMENT_ACTION.ACTIVATE]: {
    icon: PlayCircle,
    title: "Activate enrolment?",
    description: "This moves the enrolment from draft to active.",
    body: "Activating sends the apprentice a portal invitation and notifies the provider. The pipeline advances to “invited”.",
    confirmLabel: "Activate",
    danger: false,
  },
  [ENROLMENT_ACTION.ACCEPT_PROVIDER]: {
    icon: Handshake,
    title: "Accept as provider?",
    description: "Confirm provider acceptance for this enrolment.",
    body: "This advances the pipeline to “provider accepted”. The apprentice account must already be created.",
    confirmLabel: "Accept",
    danger: false,
  },
  [ENROLMENT_ACTION.COMPLETE]: {
    icon: CheckCircle2,
    title: "Complete enrolment?",
    description: "This moves the enrolment from active to completed.",
    body: "Completing archives messaging threads and queues a DAS completion push. You can record the EPA outcome afterwards.",
    confirmLabel: "Complete",
    danger: false,
  },
  [ENROLMENT_ACTION.CANCEL]: {
    icon: CircleX,
    title: "Cancel enrolment?",
    description: "This cannot be undone.",
    body: "Cancelling withdraws the enrolment and queues a withdrawal push. Only draft or active enrolments can be cancelled.",
    confirmLabel: "Cancel enrolment",
    danger: true,
  },
};

/**
 * Confirmation modal for the no-body lifecycle actions. The EPA-outcome action
 * has its own form modal; this handles activate / accept-provider / complete /
 * cancel uniformly.
 *
 * @param {string}   action     one of ENROLMENT_ACTION (except EPA_OUTCOME)
 * @param {object}   mutation   the instantiated mutation ({ mutateAsync, isPending })
 * @param {string}   enrolmentId
 */
export function EnrolmentActionModal({
  action,
  enrolmentId,
  open,
  onClose,
  mutation,
}) {
  const meta = action ? ACTION_META[action] : null;
  const isPending = mutation?.isPending ?? false;

  if (!meta) return null;

  const Icon = meta.icon;

  const handleConfirm = async () => {
    await mutation.mutateAsync(enrolmentId);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={isPending}
      size="md"
      icon={<Icon className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={meta.title}
      description={meta.description}
      footer={
        <Button
          type="button"
          color={meta.danger ? "black" : "green"}
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={handleConfirm}
          className={
            meta.danger
              ? "!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
              : undefined
          }
        >
          {meta.confirmLabel}
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">{meta.body}</p>
    </Modal>
  );
}
