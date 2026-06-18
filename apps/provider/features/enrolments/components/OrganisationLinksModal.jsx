"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useSetEnrolmentOrganisationLinks } from "../queries/enrolments.query";
import {
  organisationLinksDefaultsFromRow,
  organisationLinksSchema,
  toOrganisationLinksPayload,
} from "../schemas";

export function OrganisationLinksModal({ enrolment, open, onClose }) {
  const defaults = useMemo(
    () => organisationLinksDefaultsFromRow(enrolment),
    [enrolment],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(organisationLinksSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useSetEnrolmentOrganisationLinks();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        id: enrolment.id,
        payload: toOrganisationLinksPayload(values),
      });
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
      icon={<Building2 className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Edit organisation links"
      description="Counterpart employer/provider organisations for cross-portal reporting. Clearing a field unlinks it."
      footer={
        <Button
          type="submit"
          form="org-links-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save links
        </Button>
      }
    >
      <form
        id="org-links-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <InputField
          name="employerOrganisationId"
          label="Employer organisation ID"
          placeholder="UUID"
          register={register}
          error={errors.employerOrganisationId?.message}
          disabled={disabled}
        />
        <InputField
          name="providerOrganisationId"
          label="Provider organisation ID"
          placeholder="UUID"
          register={register}
          error={errors.providerOrganisationId?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
