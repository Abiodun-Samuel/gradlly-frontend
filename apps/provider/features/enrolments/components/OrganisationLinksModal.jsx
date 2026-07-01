"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useLinkedEmployerOptions } from "@/features/reporting/queries/reporting.query";
import { applyServerErrors } from "@/lib/errors";

import {
  useLookupCounterpartOrganisation,
  useSetEnrolmentOrganisationLinks,
} from "../queries/enrolments.query";
import {
  employerOrganisationLinkDefaultsFromRow,
  employerOrganisationLinkSchema,
  toEmployerOrganisationLinkPayload,
} from "../schemas";

function mergeSelectedOption(options, selectedId, selectedLabel) {
  if (!selectedId || options.some((option) => option.value === selectedId)) {
    return options;
  }

  return [
    {
      value: selectedId,
      text: selectedLabel ?? `Linked employer (${selectedId.slice(0, 8)}…)`,
    },
    ...options,
  ];
}

function OrganisationLinksModalForm({ enrolment, onClose, onBusyChange }) {
  const defaults = useMemo(
    () => employerOrganisationLinkDefaultsFromRow(enrolment),
    [enrolment],
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employerOrganisationLinkSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const employerOrganisationId = useWatch({
    control,
    name: "employerOrganisationId",
  });

  const [ukprn, setUkprn] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [resolvedEmployer, setResolvedEmployer] = useState(null);

  const {
    data: linkedEmployerOptions = [],
    isLoading: loadingLinkedEmployers,
  } = useLinkedEmployerOptions({ enabled: true });

  const employerSelectOptions = useMemo(() => {
    const fromLookup =
      resolvedEmployer &&
      !linkedEmployerOptions.some(
        (option) => option.value === resolvedEmployer.id,
      )
        ? [{ value: resolvedEmployer.id, text: resolvedEmployer.name }]
        : [];

    return mergeSelectedOption(
      [...fromLookup, ...linkedEmployerOptions],
      defaults.employerOrganisationId,
    );
  }, [
    linkedEmployerOptions,
    resolvedEmployer,
    defaults.employerOrganisationId,
  ]);

  const { mutateAsync: lookupEmployer, isPending: lookupPending } =
    useLookupCounterpartOrganisation();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentOrganisationLinks();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    onBusyChange(disabled);
    return () => onBusyChange(false);
  }, [disabled, onBusyChange]);

  const handleUkprnLookup = async () => {
    setLookupError("");
    const trimmed = ukprn.trim();
    if (!/^\d{8}$/.test(trimmed)) {
      setLookupError("Enter the employer's 8-digit UKPRN.");
      return;
    }

    try {
      const employer = await lookupEmployer(trimmed);
      setResolvedEmployer(employer);
      setValue("employerOrganisationId", employer.id, { shouldValidate: true });
    } catch (err) {
      setLookupError(
        err.message || "No employer organisation found for this UKPRN.",
      );
    }
  };

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        id: enrolment.id,
        payload: toEmployerOrganisationLinkPayload(values),
      });
      onClose();
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  return (
    <form
      id="org-links-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      <ServerErrorAlert error={serverError} />

      <SingleSelectField
        name="employerOrganisationId"
        label="Linked employer"
        options={employerSelectOptions}
        register={register}
        setValue={setValue}
        value={employerOrganisationId ?? ""}
        error={errors.employerOrganisationId?.message}
        placeholder={
          loadingLinkedEmployers
            ? "Loading linked employers…"
            : employerSelectOptions.length > 0
              ? "Select a linked employer"
              : "No linked employers yet"
        }
        disabled={disabled || loadingLinkedEmployers}
      />

      <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
        <p className="text-sm font-medium text-neutral-800">
          Link a new employer
        </p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Enter the employer&apos;s UKPRN from their organisation profile
          (Settings → Organisation on the employer portal).
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <InputField
              name="employerUkprn"
              label="Employer UKPRN"
              inputMode="numeric"
              pattern="\d{8}"
              maxLength={8}
              placeholder="10012345"
              value={ukprn}
              onChange={(event) => setUkprn(event.target.value)}
              error={lookupError}
              disabled={disabled || lookupPending}
            />
          </div>
          <Button
            type="button"
            color="black"
            variant="neutral"
            size="sm"
            loading={lookupPending}
            disabled={disabled || lookupPending}
            startIcon={<Search className="size-4" />}
            onClick={handleUkprnLookup}
          >
            Look up
          </Button>
        </div>
        {resolvedEmployer ? (
          <p className="mt-3 text-xs text-green-700">
            Resolved:{" "}
            <span className="font-medium">{resolvedEmployer.name}</span>
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function OrganisationLinksModal({ enrolment, open, onClose }) {
  const [busy, setBusy] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      size="lg"
      icon={<Building2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Link employer organisation"
      description="Choose an existing linked employer or resolve a new one by UKPRN. Clear the selection to unlink."
      footer={
        <Button
          type="submit"
          form="org-links-form"
          color="green"
          size="sm"
          loading={busy}
          disabled={busy || !open}
        >
          Save link
        </Button>
      }
    >
      {open ? (
        <OrganisationLinksModalForm
          key={enrolment.id}
          enrolment={enrolment}
          onClose={onClose}
          onBusyChange={setBusy}
        />
      ) : null}
    </Modal>
  );
}
