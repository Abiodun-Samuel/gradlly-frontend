"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Users2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useSetEnrolmentParticipants } from "../queries/enrolments.query";
import {
  participantsDefaultsFromRow,
  participantsSchema,
  toParticipantsPayload,
} from "../schemas";

export function ParticipantsModal({ enrolment, open, onClose }) {
  const defaults = useMemo(
    () => participantsDefaultsFromRow(enrolment),
    [enrolment],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(participantsSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentParticipants();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        id: enrolment.id,
        payload: toParticipantsPayload(values),
      });
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
      size="lg"
      icon={<Users2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Edit participants"
      description="Platform user IDs used for direct messaging threads. Leave a field blank to keep its current value."
      footer={
        <Button
          type="submit"
          form="participants-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save participants
        </Button>
      }
    >
      <form
        id="participants-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          name="apprenticeUserId"
          label="Apprentice user ID"
          placeholder="UUID"
          register={register}
          error={errors.apprenticeUserId?.message}
          disabled={disabled}
        />
        <InputField
          name="tutorUserId"
          label="Tutor user ID"
          placeholder="UUID"
          register={register}
          error={errors.tutorUserId?.message}
          disabled={disabled}
        />
        <InputField
          name="employerManagerUserId"
          label="Employer manager user ID"
          placeholder="UUID"
          register={register}
          error={errors.employerManagerUserId?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
