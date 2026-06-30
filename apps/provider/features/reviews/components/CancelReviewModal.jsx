"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useCancelReview } from "../queries/reviews.query";

export function CancelReviewModal({ review, open, onClose }) {
  const { mutateAsync, isPending } = useCancelReview();

  const handleCancel = async () => {
    try {
      await mutateAsync(review?.id);
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
      title="Cancel review?"
      description="This cannot be undone."
      footer={
        <Button
          type="button"
          color="black"
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={handleCancel}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Cancel review
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-600">
        The review{" "}
        <span className="font-semibold text-neutral-900">
          {review?.title || "scheduled review"}
        </span>{" "}
        will be cancelled. Its record and any signatures will be retained but it
        can no longer progress.
      </p>
    </Modal>
  );
}
