"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toastSuccess } from "@/hooks/useToast";
import { applyServerErrors } from "@/lib/errors";

import { useCreateAiProgrammeEnrolment } from "../queries/ai-programmes.query";
import {
  enrolAiApprenticeDefaults,
  enrolAiApprenticeSchema,
  toEnrolmentPayload,
} from "../schemas";

function EnrolForm({ programmeId, onDone, onBusyChange }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enrolAiApprenticeSchema),
    defaultValues: enrolAiApprenticeDefaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useCreateAiProgrammeEnrolment();
  const disabled = isSubmitting || isPending;

  // Keep the Modal's close/cancel blocked while the enrol request is in flight.
  useEffect(() => {
    onBusyChange(disabled);
    return () => onBusyChange(false);
  }, [disabled, onBusyChange]);

  const onSubmit = async (values) => {
    try {
      const result = await mutateAsync(toEnrolmentPayload(programmeId, values));
      toastSuccess("Apprentice enrolled");
      onDone();
      // Straight into the module checklist for the new enrolment.
      if (result?.enrolmentId) router.push(`/learners/${result.enrolmentId}`);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <form
      id="enrol-ai-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      <ServerErrorAlert error={serverError} />
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          name="firstName"
          label="First name"
          register={register}
          error={errors.firstName?.message}
        />
        <InputField
          name="lastName"
          label="Last name"
          register={register}
          error={errors.lastName?.message}
        />
      </div>
      <InputField
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email?.message}
      />
      <InputField
        name="plannedStartDate"
        label="Planned start date (optional)"
        type="date"
        register={register}
        error={errors.plannedStartDate?.message}
      />
    </form>
  );
}

export function EnrolApprenticeModal({ programmeId, open, onClose }) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      icon={<UserPlus className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Enrol an apprentice"
      description="Create a learner and enrol them onto this AI programme."
      footer={
        <Button
          type="submit"
          form="enrol-ai-form"
          color="green"
          loading={busy}
          disabled={!open}
        >
          Enrol apprentice
        </Button>
      }
    >
      {open ? (
        <EnrolForm
          key={programmeId}
          programmeId={programmeId}
          onDone={onClose}
          onBusyChange={setBusy}
        />
      ) : null}
    </Modal>
  );
}
