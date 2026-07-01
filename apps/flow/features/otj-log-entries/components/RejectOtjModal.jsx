"use client";

import { XCircle } from "lucide-react";
import { useState } from "react";

import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { useBulkRejectOtj } from "../queries/otj-log-entries.query";

/**
 * Bulk-reject the given submitted entries with an optional shared reason.
 *
 * @param {string[]} ids        entry ids to reject
 * @param {Function} [onDone]   called after a successful reject (e.g. clear selection)
 */
export function RejectOtjModal({ ids = [], open, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const { mutateAsync, isPending } = useBulkRejectOtj();

  // Reset on the way out so the next open starts clean (no setState-in-effect).
  const handleClose = () => {
    if (isPending) return;
    setReason("");
    onClose();
  };

  const handleReject = async () => {
    try {
      await mutateAsync({ ids, reason: reason.trim() || undefined });
      onDone?.();
      setReason("");
      onClose();
    } catch {
      // surfaced via the mutation's onError toast
    }
  };

  const count = ids.length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={isPending}
      size="md"
      icon={<XCircle className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={`Reject ${count} ${count === 1 ? "entry" : "entries"}?`}
      description="The apprentice can see the reason and resubmit."
      footer={
        <Button
          type="button"
          color="black"
          variant="solid"
          size="sm"
          loading={isPending}
          disabled={isPending || count === 0}
          onClick={handleReject}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Reject {count > 0 ? count : ""}
        </Button>
      }
    >
      <TextareaField
        name="reason"
        label="Reason (optional)"
        placeholder="e.g. Insufficient detail — please add what you learned."
        rows={4}
        maxLength={1000}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={isPending}
      />
    </Modal>
  );
}
