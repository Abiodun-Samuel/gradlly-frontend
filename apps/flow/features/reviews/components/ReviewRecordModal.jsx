"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useSaveReviewRecord } from "../queries/reviews.query";
import {
  emptySmartGoal,
  reviewRecordDefaultsFromPayload,
  reviewRecordSchema,
  toRecordPayload,
} from "../schemas";

const SMART_FIELDS = [
  { name: "objective", label: "Objective" },
  { name: "measurable", label: "Measurable" },
  { name: "achievable", label: "Achievable" },
  { name: "relevant", label: "Relevant" },
  { name: "timeBound", label: "Time-bound" },
];

/**
 * Create/update the structured review record (SMART goals + wellbeing + notes).
 * @param {string} reviewId
 * @param {object|null} record   existing ReviewRecordResponseDto.payload (or null)
 */
export function ReviewRecordModal({ reviewId, record, open, onClose }) {
  const defaults = useMemo(
    () => reviewRecordDefaultsFromPayload(record),
    [record],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewRecordSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "smartGoals",
  });

  const { mutateAsync, isPending, error: serverError } = useSaveReviewRecord();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({ id: reviewId, body: toRecordPayload(values) });
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
      size="2xl"
      icon={
        <ClipboardList className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title="Review record"
      description="SMART goals, wellbeing and agreed actions captured during the meeting."
      footer={
        <Button
          type="submit"
          form="review-record-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save record
        </Button>
      }
    >
      <form
        id="review-record-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <ServerErrorAlert error={serverError} />

        {/* SMART goals */}
        <fieldset className="space-y-4">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-semibold text-neutral-900">
              SMART goals
            </legend>
            <Button
              type="button"
              size="xs"
              color="black"
              variant="neutral"
              startIcon={<Plus className="size-3.5" />}
              onClick={() => append({ ...emptySmartGoal })}
              disabled={disabled}
            >
              Add goal
            </Button>
          </div>

          {typeof errors.smartGoals?.message === "string" ? (
            <p className="text-xs text-danger-600">
              {errors.smartGoals.message}
            </p>
          ) : null}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-xl border border-neutral-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Goal {index + 1}
                  </p>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={disabled}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-danger-600 transition-colors hover:bg-danger-50"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </button>
                  ) : null}
                </div>

                <InputField
                  required
                  name={`smartGoals.${index}.objective`}
                  label="Objective"
                  register={register}
                  error={errors.smartGoals?.[index]?.objective?.message}
                  disabled={disabled}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SMART_FIELDS.filter((f) => f.name !== "objective").map(
                    (f) => (
                      <InputField
                        key={f.name}
                        required
                        name={`smartGoals.${index}.${f.name}`}
                        label={f.label}
                        register={register}
                        error={errors.smartGoals?.[index]?.[f.name]?.message}
                        disabled={disabled}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Wellbeing */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Wellbeing
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              name="wellbeingScore"
              label="Score (1–10)"
              type="number"
              inputMode="numeric"
              min="1"
              max="10"
              step="1"
              register={register}
              error={errors.wellbeingScore?.message}
              disabled={disabled}
            />
          </div>
          <TextareaField
            name="wellbeingNotes"
            label="Wellbeing notes"
            rows={2}
            register={register}
            error={errors.wellbeingNotes?.message}
            disabled={disabled}
          />
        </fieldset>

        {/* Progress + actions */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Progress & actions
          </legend>
          <TextareaField
            name="progressSummary"
            label="Progress summary"
            rows={3}
            register={register}
            error={errors.progressSummary?.message}
            disabled={disabled}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextareaField
              name="actionsAgreed"
              label="Actions agreed"
              rows={3}
              register={register}
              error={errors.actionsAgreed?.message}
              disabled={disabled}
            />
            <TextareaField
              name="employerComments"
              label="Employer comments"
              rows={3}
              register={register}
              error={errors.employerComments?.message}
              disabled={disabled}
            />
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
