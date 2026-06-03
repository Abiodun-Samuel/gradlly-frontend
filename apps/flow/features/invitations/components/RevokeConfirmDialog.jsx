"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useRevokeInvitation } from "../queries/invitations.query";

export function RevokeConfirmDialog({ invitation, open, onClose }) {
  const { mutateAsync, isPending } = useRevokeInvitation();

  const handleRevoke = async () => {
    await mutateAsync(invitation?.id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button
            type="button"
            color="black"
            variant="neutral"
            size="sm"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
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
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 px-6 py-7 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="size-7 text-red-500" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-neutral-900">
            Revoke invitation?
          </h3>
          <p className="text-sm leading-relaxed text-neutral-500">
            The pending invitation for{" "}
            <span className="font-semibold text-neutral-700">
              {invitation?.email}
            </span>{" "}
            will be cancelled. They will no longer be able to use that link.
          </p>
        </div>
      </div>
    </Modal>
  );
}
