"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useCreateReview, useUpdateReview } from "../queries/reviews.query";
import {
  reviewScheduleDefaults,
  reviewScheduleDefaultsFromRow,
  reviewScheduleSchema,
  toCreateReviewPayload,
  toUpdateReviewPayload,
} from "../schemas";

/**
 * Schedule a new review (create) or reschedule/edit an existing one.
 * One form for both flows (DRY); `review` switches to edit mode.
 *
 * @param {object} [review]   the review to edit (omit for create)
 * @param {{enrolmentId, apprenticeId}} context  required for create
 */
export function ReviewScheduleModal({
  open,
  onClose,
  review = null,
  context = {},
}) {
  const isEdit = Boolean(review);

  const defaults = useMemo(
    () =>
      isEdit ? reviewScheduleDefaultsFromRow(review) : reviewScheduleDefaults,
    [isEdit, review],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewScheduleSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const create = useCreateReview();
  const update = useUpdateReview();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = isEdit ? update : create;
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await mutateAsync({
          id: review.id,
          payload: toUpdateReviewPayload(values),
        });
      } else {
        await mutateAsync(
          toCreateReviewPayload(values, {
            enrolmentId: context.enrolmentId,
            apprenticeId: context.apprenticeId,
          }),
        );
      }
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
        <CalendarClock className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={isEdit ? "Reschedule review" : "Schedule review"}
      description="The tripartite progress review signed by apprentice, tutor and employer manager."
      footer={
        <Button
          type="submit"
          form="review-schedule-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <CalendarClock className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Schedule review"}
        </Button>
      }
    >
      <form
        id="review-schedule-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          required
          name="scheduledAt"
          label="Date & time"
          type="datetime-local"
          register={register}
          error={errors.scheduledAt?.message}
          disabled={disabled}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="title"
            label="Title"
            placeholder="Quarterly progress review"
            register={register}
            error={errors.title?.message}
            disabled={disabled}
          />
          <InputField
            name="reviewType"
            label="Type"
            placeholder="12-week"
            register={register}
            error={errors.reviewType?.message}
            disabled={disabled}
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-900">
            Signing parties
          </legend>
          <p className="-mt-2 text-xs text-neutral-500">
            Platform user IDs signing in order: apprentice → tutor → employer
            manager.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              required
              name="apprenticeUserId"
              label="Apprentice user ID"
              placeholder="UUID"
              register={register}
              error={errors.apprenticeUserId?.message}
              disabled={disabled}
            />
            <InputField
              required
              name="tutorUserId"
              label="Tutor user ID"
              placeholder="UUID"
              register={register}
              error={errors.tutorUserId?.message}
              disabled={disabled}
            />
            <InputField
              required
              name="employerManagerUserId"
              label="Employer manager user ID"
              placeholder="UUID"
              register={register}
              error={errors.employerManagerUserId?.message}
              disabled={disabled}
            />
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
