"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { useFileUpload } from "@/components/ui/FileUpload";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useCreateOtjLog } from "@/features/otj/queries/otj.query";
import { otjLogDefaults, otjLogSchema } from "@/features/otj/schemas";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { applyServerErrors } from "@/lib/errors";
import { cn } from "@/utils/helper";

import { OTJLogStep1 } from "./OTJLogStep1";
import { OTJLogStep2 } from "./OTJLogStep2";
import { OTJLogStep3 } from "./OTJLogStep3";

const META = [
  { title: "Log a session", description: "Step 1 of 2 · Session details" },
  {
    title: "Attach evidence",
    description: "Step 2 of 2 · Supporting files (optional)",
  },
  {
    title: "Session logged ✓",
    description: "Submitted for review by your training provider",
  },
];

function StepBar({ step }) {
  if (step >= 2) return null;
  return (
    <div className="flex items-center gap-2 mb-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === step
              ? "bg-primary-600 w-8"
              : i < step
                ? "bg-primary-400 w-4"
                : "bg-neutral-200 w-4",
          )}
        />
      ))}
    </div>
  );
}

export function OTJLogModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const { orgId, memberId } = useAuthUser();
  const { data: summary } = useLearnerSummary({ enabled: open && !!orgId });

  const enrolmentId = summary?.activeEnrolmentId ?? null;
  const apprenticeId = summary?.activeApprenticeId ?? null;

  const {
    mutateAsync: submitLog,
    isPending,
    error: serverError,
    reset: resetMutation,
  } = useCreateOtjLog();

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    control,
    setValue,
    getValues,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otjLogSchema),
    defaultValues: otjLogDefaults,
    mode: "onBlur",
  });

  const {
    uploads,
    addFiles,
    removeFile,
    retryFile,
    uploadedKeys,
    isUploading,
    reset: resetUploads,
  } = useFileUpload({
    category: "evidence",
    learnerId: memberId,
    orgId,
    maxFiles: 5,
    maxSizeMb: 10,
  });

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(0);
      resetForm();
      resetUploads();
      resetMutation();
    }, 350);
  }

  async function handleNext() {
    const valid = await trigger([
      "activityName",
      "category",
      "loggedDate",
      "hours",
    ]);
    if (valid) setStep(1);
  }

  const onSubmit = async (values) => {
    if (!enrolmentId || !apprenticeId) {
      return;
    }

    try {
      await submitLog({
        enrolmentId,
        apprenticeId,
        loggedDate: values.loggedDate,
        minutes: Math.round(Number(values.hours) * 60),
        activityName: values.activityName.trim(),
        category: values.category,
        evidence: uploadedKeys.length > 0 ? { files: uploadedKeys } : {},
      });
      setStep(2);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  const footer =
    step === 0 ? (
      <Button size="sm" onClick={handleNext}>
        Next step →
      </Button>
    ) : step === 1 ? (
      <>
        <Button variant="outline" size="sm" onClick={() => setStep(0)}>
          ← Back
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={isUploading || !enrolmentId || !apprenticeId || !orgId}
          title={
            !orgId
              ? "Your training provider organisation is not loaded yet"
              : !enrolmentId || !apprenticeId
                ? "No active enrolment found"
                : isUploading
                  ? "Wait for files to finish uploading"
                  : undefined
          }
        >
          Log session
        </Button>
      </>
    ) : (
      <Button size="sm" onClick={handleClose}>
        Done
      </Button>
    );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={META[step].title}
      description={META[step].description}
      hideCancel={step > 0}
      footer={footer}
    >
      <StepBar step={step} />
      {serverError && step < 2 && (
        <ServerErrorAlert error={serverError} showFieldList className="mb-4" />
      )}
      <div
        key={step}
        style={{ animation: "slide-up 220ms var(--ease-out) both" }}
      >
        {step === 0 && (
          <OTJLogStep1
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
          />
        )}
        {step === 1 && (
          <OTJLogStep2
            uploads={uploads}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onRetryFile={retryFile}
          />
        )}
        {step === 2 && <OTJLogStep3 form={getValues()} files={uploads} />}
      </div>
    </Modal>
  );
}
