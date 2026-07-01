"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useBuildIlrRecord } from "../queries/ilr.query";
import { ilrBuildDefaults, ilrBuildSchema, toBuildPayload } from "../schemas";

/**
 * Build (or refresh) an ILR learner record from an enrolment. Re-building the
 * same enrolment refreshes auto-mapped fields while keeping manual overrides.
 */
export function BuildIlrModal({ open, onClose, onBuilt }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ilrBuildSchema),
    defaultValues: ilrBuildDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error: serverError } = useBuildIlrRecord();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(ilrBuildDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      const record = await mutateAsync(toBuildPayload(values));
      onBuilt?.(record);
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
      icon={<FilePlus2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Build ILR record"
      description="Generate the ILR record for an enrolment from its domain data."
      footer={
        <Button
          type="submit"
          form="ilr-build-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={<FilePlus2 className="size-4" />}
        >
          Build record
        </Button>
      }
    >
      <form
        id="ilr-build-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          required
          name="enrolmentId"
          label="Enrolment ID"
          placeholder="UUID of the enrolment"
          register={register}
          error={errors.enrolmentId?.message}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="collectionPeriod"
            label="Collection period"
            placeholder="2025-10"
            register={register}
            error={errors.collectionPeriod?.message}
            disabled={disabled}
          />
          <InputField
            required
            name="academicYear"
            label="Academic year"
            placeholder="2025-26"
            register={register}
            error={errors.academicYear?.message}
            disabled={disabled}
          />
        </div>
      </form>
    </Modal>
  );
}
