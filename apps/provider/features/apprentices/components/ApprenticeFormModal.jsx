"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, UserRoundPlus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { APPRENTICE_STATUS_OPTIONS } from "../constants";
import {
  useCreateApprentice,
  useUpdateApprentice,
} from "../queries/apprentices.query";
import {
  apprenticeDefaults,
  apprenticeDefaultsFromRow,
  apprenticeSchema,
  toApprenticePayload,
} from "../schemas";

/**
 * Create / edit an apprentice. A single form serves both flows (DRY); the
 * presence of `apprentice` switches it into edit mode. Apprentices are
 * independent — they only need the active organisation.
 */
export function ApprenticeFormModal({ open, onClose, apprentice = null }) {
  const isEdit = Boolean(apprentice);

  const defaults = useMemo(
    () => (isEdit ? apprenticeDefaultsFromRow(apprentice) : apprenticeDefaults),
    [isEdit, apprentice],
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
    resolver: zodResolver(apprenticeSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const statusValue = useWatch({ control, name: "status" });

  const create = useCreateApprentice();
  const update = useUpdateApprentice();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = isEdit ? update : create;
  const disabled = isSubmitting || isPending;

  // Re-seed the form whenever the modal opens (or the target row changes).
  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    const payload = toApprenticePayload(values);
    try {
      if (isEdit) {
        await mutateAsync({ id: apprentice.id, payload });
      } else {
        await mutateAsync(payload);
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
      size="md"
      icon={
        <UserRoundPlus className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={isEdit ? "Edit apprentice" : "Add apprentice"}
      description={
        isEdit
          ? "Update this apprentice's details."
          : "Add a learner to your organisation. They can be enrolled onto a standard later."
      }
      footer={
        <Button
          type="submit"
          form="apprentice-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <UserRoundPlus className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Add apprentice"}
        </Button>
      }
    >
      <form
        id="apprentice-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="firstName"
            label="First name"
            placeholder="Jane"
            autoComplete="given-name"
            register={register}
            error={errors.firstName?.message}
            disabled={disabled}
          />
          <InputField
            required
            name="lastName"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            register={register}
            error={errors.lastName?.message}
            disabled={disabled}
          />
        </div>

        <InputField
          required
          name="email"
          label="Email address"
          type="email"
          placeholder="jane.doe@acme.com"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
          disabled={disabled}
        />

        <SingleSelectField
          required
          name="status"
          label="Status"
          options={APPRENTICE_STATUS_OPTIONS}
          register={register}
          setValue={setValue}
          value={statusValue}
          error={errors.status?.message}
          placeholder="Select a status"
          searchable={false}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
