"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getFullName } from "@/utils/helper";

import { useDeleteApprentice } from "../queries/apprentices.query";

export function DeleteApprenticeModal({ apprentice, open, onClose }) {
  const { mutateAsync, isPending } = useDeleteApprentice();

  const handleDelete = async () => {
    await mutateAsync(apprentice?.id);
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
      title="Delete apprentice?"
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
          Delete apprentice
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        The apprentice{" "}
        <span className="font-semibold text-neutral-900">
          {getFullName(apprentice)}
        </span>{" "}
        ({apprentice?.email}) will be removed. Enrolments referencing them may
        be affected.
      </p>
    </Modal>
  );
}
