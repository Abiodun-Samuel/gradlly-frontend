"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { EPA_OUTCOME_OPTIONS } from "../constants";
import { useRecordEpaOutcome } from "../queries/enrolments.query";
import { epaOutcomeDefaults, epaOutcomeSchema } from "../schemas";

export function EpaOutcomeModal({ enrolmentId, open, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(epaOutcomeSchema),
    defaultValues: epaOutcomeDefaults,
    mode: "onBlur",
  });

  const outcomeValue = useWatch({ control, name: "outcome" });

  const { mutateAsync, isPending, error: serverError } = useRecordEpaOutcome();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(epaOutcomeDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: enrolmentId, payload: values });
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
      icon={<Award className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Record EPA outcome"
      description="Capture the end-point assessment result. This can only be recorded once."
      footer={
        <Button
          type="submit"
          form="epa-outcome-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={<Award className="size-4" />}
        >
          Record outcome
        </Button>
      }
    >
      <form
        id="epa-outcome-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <SingleSelectField
          required
          name="outcome"
          label="Outcome"
          options={EPA_OUTCOME_OPTIONS}
          register={register}
          setValue={setValue}
          value={outcomeValue}
          error={errors.outcome?.message}
          placeholder="Select an outcome"
          searchable={false}
          disabled={disabled}
        />

        <InputField
          required
          name="assessedOn"
          label="Assessed on"
          type="date"
          register={register}
          error={errors.assessedOn?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
