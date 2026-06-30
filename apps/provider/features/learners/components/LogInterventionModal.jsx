"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Megaphone } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { INTERVENTION_ACTION_OPTIONS } from "../constants";
import { useLogIntervention } from "../queries/learners.query";
import {
  interventionDefaults,
  interventionSchema,
  toInterventionPayload,
} from "../schemas";

/**
 * Log a tutor intervention against an enrolment.
 * @param {string} enrolmentId
 * @param {string} [learnerName]  for the modal header
 */
export function LogInterventionModal({
  enrolmentId,
  learnerName,
  open,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(interventionSchema),
    defaultValues: interventionDefaults,
    mode: "onBlur",
  });

  const actionTypeValue = useWatch({ control, name: "actionType" });
  const { mutateAsync, isPending, error: serverError } = useLogIntervention();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(interventionDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        enrolmentId,
        payload: toInterventionPayload(values),
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
      size="md"
      icon={<Megaphone className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Log intervention"
      description={
        learnerName
          ? `Record a tutor action for ${learnerName}.`
          : "Record a tutor action against this enrolment."
      }
      footer={
        <Button
          type="submit"
          form="intervention-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Log action
        </Button>
      }
    >
      <form
        id="intervention-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <SingleSelectField
          required
          name="actionType"
          label="Action"
          options={INTERVENTION_ACTION_OPTIONS}
          register={register}
          setValue={setValue}
          value={actionTypeValue}
          error={errors.actionType?.message}
          placeholder="Select an action"
          searchable={false}
          disabled={disabled}
        />

        <TextareaField
          name="notes"
          label="Notes"
          placeholder="e.g. Called apprentice, agreed to catch up OTJ by Friday."
          rows={4}
          maxLength={2000}
          register={register}
          error={errors.notes?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
