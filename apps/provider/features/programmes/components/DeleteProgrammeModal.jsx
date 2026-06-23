"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useDeleteProgramme } from "../queries/programmes.query";

export function DeleteProgrammeModal({ programme, open, onClose }) {
  const { mutateAsync, isPending } = useDeleteProgramme();

  const handleDelete = async () => {
    await mutateAsync(programme?.id);
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
      title="Delete programme?"
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
          Delete programme
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        The programme{" "}
        <span className="font-semibold text-neutral-900">
          {programme?.title}
        </span>{" "}
        ({programme?.code}) will be removed. Standards linked to it may be
        affected.
      </p>
    </Modal>
  );
}
