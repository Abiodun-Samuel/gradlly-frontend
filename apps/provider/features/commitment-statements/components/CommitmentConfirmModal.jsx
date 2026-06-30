"use client";

import { AlertTriangle, Send } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { COMMITMENT_ACTION } from "../constants";

// Config for the two no-body confirm actions.
const CONFIG = {
  [COMMITMENT_ACTION.PUBLISH]: {
    icon: Send,
    title: "Publish commitment statement?",
    description: "It will be locked for editing and a snapshot PDF generated.",
    body: "Once published, the statement can no longer be edited. A snapshot PDF is generated, after which the parties can sign in order.",
    confirmLabel: "Publish",
    danger: false,
  },
  [COMMITMENT_ACTION.CANCEL]: {
    icon: AlertTriangle,
    title: "Cancel commitment statement?",
    description: "This cannot be undone.",
    body: "The statement will be cancelled. You can later create a new version for this enrolment if needed.",
    confirmLabel: "Cancel statement",
    danger: true,
  },
};

/**
 * Confirm dialog for publish / cancel (both take no request body).
 *
 * @param {"publish"|"cancel"|null} action
 * @param {object} mutation  the TanStack mutation for the action
 * @param {string} statementId
 */
export function CommitmentConfirmModal({
  action,
  statementId,
  mutation,
  open,
  onClose,
}) {
  const config = action ? CONFIG[action] : null;
  const isPending = mutation?.isPending ?? false;

  const handleConfirm = async () => {
    if (!mutation || !statementId) return;
    try {
      await mutation.mutateAsync(statementId);
      onClose();
    } catch {
      // Errors are surfaced via the mutation's onError toast.
    }
  };

  if (!config) return null;
  const Icon = config.icon;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={isPending}
      size="md"
      icon={<Icon className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={config.title}
      description={config.description}
      footer={
        <Button
          type="button"
          color={config.danger ? "black" : "green"}
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={handleConfirm}
          className={
            config.danger
              ? "!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
              : undefined
          }
        >
          {config.confirmLabel}
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">{config.body}</p>
    </Modal>
  );
}
