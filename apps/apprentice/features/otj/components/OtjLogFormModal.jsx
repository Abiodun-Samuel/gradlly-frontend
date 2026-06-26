"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useCreateOtjLogEntry, useOtjCategories } from "../queries/otj.query";

const otjSchema = z.object({
  activityName: z.string().min(1, "Activity name is required").max(80),
  category: z.string().min(1, "Category is required"),
  loggedDate: z.string().min(1, "Date is required"),
  minutes: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
  note: z.string().optional(),
});

function getDefaults({ enrolmentId, apprenticeId }) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    activityName: "",
    category: "",
    loggedDate: today,
    minutes: 60,
    note: "",
    enrolmentId: enrolmentId ?? "",
    apprenticeId: apprenticeId ?? "",
  };
}

export function OtjLogFormModal({ open, onClose, enrolmentId, apprenticeId }) {
  const defaults = useMemo(
    () => getDefaults({ enrolmentId, apprenticeId }),
    [enrolmentId, apprenticeId],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otjSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const categoryValue = useWatch({ control, name: "category" });
  const { data: categoryOptions = [] } = useOtjCategories();
  const { mutateAsync, isPending, error: serverError } = useCreateOtjLogEntry();
  const disabled = isSubmitting || isPending || !enrolmentId || !apprenticeId;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    if (!enrolmentId || !apprenticeId) return;

    const payload = {
      enrolmentId,
      apprenticeId,
      activityName: values.activityName.trim(),
      category: values.category,
      loggedDate: values.loggedDate,
      minutes: values.minutes,
      note: values.note?.trim() || undefined,
    };

    try {
      await mutateAsync(payload);
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
      icon={<Clock className="size-5 text-primary-600" />}
      title="Log OTJ activity"
      description="Record off-the-job training time for your active enrolment."
      footer={
        <Button
          type="submit"
          form="otj-log-form"
          size="sm"
          color="green"
          disabled={disabled}
          startIcon={<Save className="size-4" />}
        >
          Save entry
        </Button>
      }
    >
      <form
        id="otj-log-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        {!enrolmentId ? (
          <p className="rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">
            No active enrolment found. You need an active programme before
            logging OTJ time.
          </p>
        ) : null}

        <InputField
          name="activityName"
          label="Activity name"
          required
          register={register}
          error={errors.activityName?.message}
        />

        <SingleSelectField
          name="category"
          label="Activity type"
          required
          options={categoryOptions}
          register={register}
          setValue={setValue}
          value={categoryValue}
          error={errors.category?.message}
          placeholder="Select activity type"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="loggedDate"
            label="Date"
            type="date"
            required
            register={register}
            error={errors.loggedDate?.message}
          />
          <InputField
            name="minutes"
            label="Duration (minutes)"
            type="number"
            min={1}
            required
            register={register}
            error={errors.minutes?.message}
          />
        </div>

        <TextareaField
          name="note"
          label="Notes"
          rows={3}
          register={register}
          error={errors.note?.message}
        />
      </form>
    </Modal>
  );
}
