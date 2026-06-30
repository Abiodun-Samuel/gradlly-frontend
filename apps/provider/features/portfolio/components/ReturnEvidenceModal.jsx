"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Undo2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useReturnEvidence } from "../queries/portfolio.query";
import { evidenceReturnSchema } from "../schemas";

/**
 * Return an evidence item to the apprentice (back to draft) with a required
 * reason. Allowed from submitted or reviewed.
 */
export function ReturnEvidenceModal({ item, open, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(evidenceReturnSchema),
    defaultValues: { reason: "" },
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error: serverError } = useReturnEvidence();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset({ reason: "" });
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: item.id, reason: values.reason.trim() });
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={disabled}
      size="md"
      icon={<Undo2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Return evidence?"
      description="The item goes back to the apprentice as a draft with your reason."
      footer={
        <Button
          type="submit"
          form="return-evidence-form"
          color="black"
          variant="solid"
          size="sm"
          loading={disabled}
          disabled={disabled}
          className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700"
        >
          Return to apprentice
        </Button>
      }
    >
      <form
        id="return-evidence-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />
        <TextareaField
          required
          name="reason"
          label="Reason"
          placeholder="e.g. Please add the design document and link the relevant KSBs."
          rows={4}
          maxLength={2000}
          register={register}
          error={errors.reason?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
