"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useRevokeInvitation } from "../queries/invitations.query";

export function RevokeInvitationModal({ invitation, open, onClose }) {
  const { mutateAsync, isPending } = useRevokeInvitation();

  const handleRevoke = async () => {
    await mutateAsync(invitation?.id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={isPending}
      size="md"
      icon={
        <AlertTriangle className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Revoke invitation?"
      description="This cannot be undone."
      footer={
        <Button
          type="button"
          color="black"
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={handleRevoke}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Revoke invitation
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        The pending invitation for{" "}
        <span className="font-semibold text-neutral-900">
          {invitation?.email}
        </span>{" "}
        will be cancelled. They will no longer be able to use that link.
      </p>
    </Modal>
  );
}
