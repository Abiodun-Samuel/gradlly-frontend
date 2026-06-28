"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { useFileUpload } from "@/components/ui/FileUpload";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { useCreateKsbEvidence } from "@/features/portfolio/queries/portfolio.query";
import {
  ksbEvidenceDefaults,
  ksbEvidenceSchema,
} from "@/features/portfolio/schemas";
import { applyServerErrors } from "@/lib/errors";
import { cn } from "@/utils/helper";

import { AddEvidenceStep1 } from "./AddEvidenceStep1";
import { AddEvidenceStep2 } from "./AddEvidenceStep2";
import { AddEvidenceStep3 } from "./AddEvidenceStep3";

const META = [
  {
    title: "Add portfolio evidence",
    description: "Step 1 of 3 · Evidence details",
  },
  {
    title: "Map to KSBs",
    description: "Step 2 of 3 · Knowledge, skills & behaviours",
  },
  {
    title: "Review & submit",
    description: "Step 3 of 3 · Check everything before submitting",
  },
];

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[0, 1, 2].map((i) => (
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

export function AddEvidenceModal({ open, onClose, onEvidenceAdded }) {
  const [step, setStep] = useState(0);
  const [declared, setDeclared] = useState(false);

  const { orgId, memberId } = useAuthUser();

  const {
    mutateAsync: submitEvidence,
    isPending,
    error: serverError,
    reset: resetMutation,
  } = useCreateKsbEvidence();

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
    resolver: zodResolver(ksbEvidenceSchema),
    defaultValues: ksbEvidenceDefaults,
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
    maxFiles: 1,
    maxSizeMb: 25,
  });

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(0);
      setDeclared(false);
      resetForm();
      resetUploads();
      resetMutation();
    }, 350);
  }

  async function handleNext0() {
    const valid = await trigger(["title", "url", "text"]);
    if (valid) setStep(1);
  }

  async function handleNext1() {
    const valid = await trigger(["ksbDefinitionIds"]);
    if (valid) setStep(2);
  }

  function buildPayload(values) {
    return {
      enrolmentId: memberId ?? "",
      apprenticeId: orgId ?? "",
      type: values.type,
      title: values.title,
      body: values.text || values.notes || "",
      storageKey: values.type === "file" ? (uploadedKeys[0] ?? "") : "",
      externalUrl: values.type === "link" ? values.url : "",
      ksbDefinitionIds: values.ksbDefinitionIds,
    };
  }

  const onFormSubmit = async (values) => {
    try {
      await submitEvidence(buildPayload(values));
      onEvidenceAdded?.({ ...values, status: "submitted" });
      handleClose();
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  async function handleSaveDraft() {
    const values = getValues();
    try {
      await submitEvidence({ ...buildPayload(values), status: "draft" });
      onEvidenceAdded?.({ ...values, status: "draft" });
      handleClose();
    } catch (error) {
      applyServerErrors(error, setError);
    }
  }

  const footer =
    step === 0 ? (
      <>
        <Button variant="outline" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleNext0}
          disabled={isUploading}
          title={isUploading ? "Wait for upload to finish" : undefined}
        >
          Next →
        </Button>
      </>
    ) : step === 1 ? (
      <>
        <Button variant="outline" size="sm" onClick={() => setStep(0)}>
          ← Back
        </Button>
        <Button size="sm" onClick={handleNext1}>
          Next →
        </Button>
      </>
    ) : (
      <>
        <Button
          variant="outline"
          size="sm"
          loading={isPending}
          onClick={handleSaveDraft}
        >
          Save as draft
        </Button>
        <Button
          size="sm"
          disabled={!declared || isPending}
          loading={isPending}
          onClick={handleSubmit(onFormSubmit)}
        >
          Submit for review
        </Button>
      </>
    );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="2xl"
      title={META[step].title}
      description={META[step].description}
      footer={footer}
    >
      <StepBar step={step} />
      {serverError && (
        <ServerErrorAlert error={serverError} showFieldList className="mb-4" />
      )}
      <div
        key={step}
        style={{ animation: "slide-up 220ms var(--ease-out) both" }}
      >
        {step === 0 && (
          <AddEvidenceStep1
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            uploads={uploads}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onRetryFile={retryFile}
          />
        )}
        {step === 1 && (
          <AddEvidenceStep2
            control={control}
            setValue={setValue}
            errors={errors}
          />
        )}
        {step === 2 && (
          <AddEvidenceStep3
            values={getValues()}
            uploads={uploads}
            declared={declared}
            setDeclared={setDeclared}
          />
        )}
      </div>
    </Modal>
  );
}
