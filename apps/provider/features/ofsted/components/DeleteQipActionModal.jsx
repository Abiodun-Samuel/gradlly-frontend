"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useDeleteQipAction } from "../queries/ofsted.query";

export function DeleteQipActionModal({ action, open, onClose }) {
  const { mutateAsync, isPending } = useDeleteQipAction();

  const handleDelete = async () => {
    try {
      await mutateAsync(action?.id);
      onClose();
    } catch {
      // surfaced via mutation onError toast
    }
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
      title="Delete QIP action?"
      description="This cannot be undone."
      footer={
        <Button
          type="button"
          color="black"
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={handleDelete}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Delete action
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        <span className="font-semibold text-neutral-900">{action?.title}</span>{" "}
        will be removed from the Quality Improvement Plan.
      </p>
    </Modal>
  );
}
