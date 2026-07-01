"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Users2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import {
  useParticipantOptions,
  useSetEnrolmentParticipants,
} from "../queries/enrolments.query";
import {
  participantsDefaultsFromRow,
  participantsSchema,
  toParticipantsPayload,
} from "../schemas";

function mergeSelectedOption(options, selectedId, selectedLabel) {
  if (!selectedId || options.some((option) => option.value === selectedId)) {
    return options;
  }

  return [
    {
      value: selectedId,
      text: selectedLabel ?? `Assigned user (${selectedId.slice(0, 8)}…)`,
    },
    ...options,
  ];
}

export function ParticipantsModal({ enrolment, open, onClose }) {
  const defaults = useMemo(
    () => participantsDefaultsFromRow(enrolment),
    [enrolment],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(participantsSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const apprenticeUserId = useWatch({ control, name: "apprenticeUserId" });
  const tutorUserId = useWatch({ control, name: "tutorUserId" });
  const employerManagerUserId = useWatch({
    control,
    name: "employerManagerUserId",
  });

  const { data: participantOptions, isLoading: loadingOptions } =
    useParticipantOptions(enrolment?.id, { enabled: open && !!enrolment?.id });

  const apprenticeOptions = useMemo(
    () =>
      mergeSelectedOption(
        participantOptions?.apprenticeOptions ?? [],
        defaults.apprenticeUserId,
        enrolment?.apprenticeUserDisplayName,
      ),
    [
      participantOptions?.apprenticeOptions,
      defaults.apprenticeUserId,
      enrolment?.apprenticeUserDisplayName,
    ],
  );
  const tutorOptions = useMemo(
    () =>
      mergeSelectedOption(
        participantOptions?.tutorOptions ?? [],
        defaults.tutorUserId,
        enrolment?.tutorUserDisplayName,
      ),
    [
      participantOptions?.tutorOptions,
      defaults.tutorUserId,
      enrolment?.tutorUserDisplayName,
    ],
  );
  const employerManagerOptions = useMemo(
    () =>
      mergeSelectedOption(
        participantOptions?.employerManagerOptions ?? [],
        defaults.employerManagerUserId,
        enrolment?.employerManagerUserDisplayName,
      ),
    [
      participantOptions?.employerManagerOptions,
      defaults.employerManagerUserId,
      enrolment?.employerManagerUserDisplayName,
    ],
  );

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentParticipants();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        id: enrolment.id,
        payload: toParticipantsPayload(values),
      });
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const noEmployerManagers =
    !loadingOptions && employerManagerOptions.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={disabled}
      size="lg"
      icon={<Users2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Edit participants"
      description="Assign platform users for messaging threads. Clear a selection to leave that role unchanged."
      footer={
        <Button
          type="submit"
          form="participants-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save participants
        </Button>
      }
    >
      <form
        id="participants-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <SingleSelectField
          name="apprenticeUserId"
          label="Apprentice user"
          options={apprenticeOptions}
          register={register}
          setValue={setValue}
          value={apprenticeUserId ?? ""}
          error={errors.apprenticeUserId?.message}
          placeholder={
            loadingOptions
              ? "Loading learners…"
              : apprenticeOptions.length > 0
                ? "Select apprentice user"
                : "No matching learner account yet"
          }
          disabled={disabled || loadingOptions}
        />

        <SingleSelectField
          name="tutorUserId"
          label="Tutor"
          options={tutorOptions}
          register={register}
          setValue={setValue}
          value={tutorUserId ?? ""}
          error={errors.tutorUserId?.message}
          placeholder={loadingOptions ? "Loading tutors…" : "Select a tutor"}
          disabled={disabled || loadingOptions}
        />

        <SingleSelectField
          name="employerManagerUserId"
          label="Employer line manager"
          options={employerManagerOptions}
          register={register}
          setValue={setValue}
          value={employerManagerUserId ?? ""}
          error={errors.employerManagerUserId?.message}
          placeholder={
            loadingOptions
              ? "Loading employer contacts…"
              : noEmployerManagers
                ? "Link an employer organisation first"
                : "Select employer line manager"
          }
          disabled={disabled || loadingOptions || noEmployerManagers}
        />
      </form>
    </Modal>
  );
}
