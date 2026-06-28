"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useDeleteStandard } from "../queries/standards.query";

export function DeleteStandardModal({ standard, open, onClose }) {
  const { mutateAsync, isPending } = useDeleteStandard();

  const handleDelete = async () => {
    await mutateAsync(standard?.id);
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
      title="Delete standard?"
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
          Delete standard
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        The standard{" "}
        <span className="font-semibold text-neutral-900">
          {standard?.title}
        </span>{" "}
        ({standard?.code}) will be removed. Enrolments referencing it may be
        affected.
      </p>
    </Modal>
  );
}
