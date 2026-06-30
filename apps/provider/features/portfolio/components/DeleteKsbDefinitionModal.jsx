"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useDeleteKsbDefinition } from "../queries/portfolio.query";

export function DeleteKsbDefinitionModal({ definition, open, onClose }) {
  const { mutateAsync, isPending } = useDeleteKsbDefinition();

  const handleDelete = async () => {
    try {
      await mutateAsync(definition?.id);
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
      title="Delete KSB?"
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
          Delete KSB
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        <span className="font-semibold text-neutral-900">
          {definition?.code}
        </span>{" "}
        — {definition?.title} will be removed. Evidence already mapped to it may
        be affected.
      </p>
    </Modal>
  );
}
