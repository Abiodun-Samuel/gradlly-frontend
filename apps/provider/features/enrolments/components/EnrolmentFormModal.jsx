"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useApprenticeOptions } from "@/features/apprentices/queries/apprentices.query";
import { useStandardOptions } from "@/features/standards/queries/standards.query";
import { applyServerErrors } from "@/lib/errors";

import { useCreateEnrolment } from "../queries/enrolments.query";
import {
  createEnrolmentDefaults,
  createEnrolmentSchema,
  toCreateEnrolmentPayload,
} from "../schemas";

/**
 * Create a draft enrolment by linking an apprentice to a standard. The two
 * dropdowns are fed by GET /api/v1/apprentices and GET /api/v1/standards.
 * Enrolments are never edited via a generic PATCH — only created here, then
 * progressed through the dedicated lifecycle actions on the detail page.
 */
export function EnrolmentFormModal({ open, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createEnrolmentSchema),
    defaultValues: createEnrolmentDefaults,
    mode: "onBlur",
  });

  const apprenticeIdValue = useWatch({ control, name: "apprenticeId" });
  const standardIdValue = useWatch({ control, name: "standardId" });

  const { data: apprenticeOptions = [], isLoading: loadingApprentices } =
    useApprenticeOptions({ enabled: open });
  const { data: standardOptions = [], isLoading: loadingStandards } =
    useStandardOptions({ enabled: open });

  const { mutateAsync, isPending, error: serverError } = useCreateEnrolment();
  const disabled = isSubmitting || isPending;

  const noApprentices = !loadingApprentices && apprenticeOptions.length === 0;
  const noStandards = !loadingStandards && standardOptions.length === 0;
  const blocked = noApprentices || noStandards;

  useEffect(() => {
    if (open) reset(createEnrolmentDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync(toCreateEnrolmentPayload(values));
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
      icon={
        <ClipboardList className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Create enrolment"
      description="Link an apprentice to a standard. The enrolment starts as a draft you can activate later."
      footer={
        <Button
          type="submit"
          form="enrolment-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled || blocked}
          startIcon={<ClipboardList className="size-4" />}
        >
          Create enrolment
        </Button>
      }
    >
      <form
        id="enrolment-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        {blocked ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {noApprentices && noStandards
              ? "You need at least one apprentice and one standard before creating an enrolment."
              : noApprentices
                ? "You need at least one apprentice before creating an enrolment. Add one first."
                : "You need at least one standard before creating an enrolment. Create one first."}
          </div>
        ) : null}

        <SingleSelectField
          required
          name="apprenticeId"
          label="Apprentice"
          options={apprenticeOptions}
          register={register}
          setValue={setValue}
          value={apprenticeIdValue}
          error={errors.apprenticeId?.message}
          placeholder={
            loadingApprentices ? "Loading apprentices…" : "Select an apprentice"
          }
          disabled={disabled || loadingApprentices}
        />

        <SingleSelectField
          required
          name="standardId"
          label="Standard"
          options={standardOptions}
          register={register}
          setValue={setValue}
          value={standardIdValue}
          error={errors.standardId?.message}
          placeholder={
            loadingStandards ? "Loading standards…" : "Select a standard"
          }
          disabled={disabled || loadingStandards}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="agreedPrice"
            label="Agreed price (£)"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="12000"
            register={register}
            error={errors.agreedPrice?.message}
            disabled={disabled}
          />
          <InputField
            name="completionPaymentPercent"
            label="Completion payment (%)"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max="100"
            placeholder="20"
            register={register}
            error={errors.completionPaymentPercent?.message}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="plannedStartDate"
            label="Planned start date"
            type="date"
            register={register}
            error={errors.plannedStartDate?.message}
            disabled={disabled}
          />
          <InputField
            name="plannedEndDate"
            label="Planned end date"
            type="date"
            register={register}
            error={errors.plannedEndDate?.message}
            disabled={disabled}
          />
        </div>

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-500">
          <span className="font-semibold text-neutral-700">Tip: </span>
          All fields except apprentice and standard are optional. If you set
          both planned dates, the expected duration is derived automatically.
        </div>
      </form>
    </Modal>
  );
}
