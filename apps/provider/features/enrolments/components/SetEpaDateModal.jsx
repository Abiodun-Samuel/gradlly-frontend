"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useSetEnrolmentJourney } from "../queries/enrolments.query";
import { journeySchema, toJourneyPayload } from "../schemas";

export function SetEpaDateModal({
  enrolmentId,
  currentEpaDate,
  open,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(journeySchema),
    defaultValues: { epaDate: currentEpaDate ?? "" },
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentJourney();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset({ epaDate: currentEpaDate ?? "" });
  }, [open, currentEpaDate, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: enrolmentId, payload: toJourneyPayload(values) });
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
      icon={
        <CalendarClock className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Set EPA date"
      description="The confirmed end-point assessment date drives the countdown and pace."
      footer={
        <Button
          type="submit"
          form="epa-date-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save EPA date
        </Button>
      }
    >
      <form
        id="epa-date-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />
        <InputField
          name="epaDate"
          label="EPA date"
          type="date"
          register={register}
          error={errors.epaDate?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
