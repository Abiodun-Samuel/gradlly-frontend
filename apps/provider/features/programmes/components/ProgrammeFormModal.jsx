"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { PROGRAMME_STATUS_OPTIONS } from "../constants";
import {
  useCreateProgramme,
  useUpdateProgramme,
} from "../queries/programmes.query";
import {
  programmeDefaults,
  programmeDefaultsFromRow,
  programmeSchema,
  toProgrammePayload,
} from "../schemas";

/**
 * Create / edit a programme. The presence of `programme` switches the modal
 * between create and edit modes, so a single form serves both flows (DRY).
 */
export function ProgrammeFormModal({ open, onClose, programme = null }) {
  const isEdit = Boolean(programme);

  const defaults = useMemo(
    () => (isEdit ? programmeDefaultsFromRow(programme) : programmeDefaults),
    [isEdit, programme],
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
    resolver: zodResolver(programmeSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const statusValue = useWatch({ control, name: "status" });

  const create = useCreateProgramme();
  const update = useUpdateProgramme();
  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = isEdit ? update : create;
  const disabled = isSubmitting || isPending;

  // Re-seed the form whenever the modal opens (or the target row changes), so
  // re-opening never shows a previous edit's values.
  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    const payload = toProgrammePayload(values);
    try {
      if (isEdit) {
        await mutateAsync({ id: programme.id, payload });
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
      size="lg"
      icon={
        <GraduationCap className="size-4.5" strokeWidth={1.85} aria-hidden />
      }
      title={isEdit ? "Edit programme" : "Create programme"}
      description={
        isEdit
          ? "Update the details of this programme."
          : "A programme is the top-level curriculum container for your standards."
      }
      footer={
        <Button
          type="submit"
          form="programme-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <GraduationCap className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Create programme"}
        </Button>
      }
    >
      <form
        id="programme-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            required
            name="code"
            label="Code"
            placeholder="PRG-SE"
            register={register}
            error={errors.code?.message}
            disabled={disabled}
          />
          <SingleSelectField
            required
            name="status"
            label="Status"
            options={PROGRAMME_STATUS_OPTIONS}
            register={register}
            setValue={setValue}
            value={statusValue}
            error={errors.status?.message}
            placeholder="Select a status"
            searchable={false}
            disabled={disabled}
          />
        </div>

        <InputField
          required
          name="title"
          label="Title"
          placeholder="Software Engineering"
          register={register}
          error={errors.title?.message}
          disabled={disabled}
        />

        <TextareaField
          name="description"
          label="Description"
          placeholder="Optional summary of this programme."
          rows={4}
          maxLength={2000}
          register={register}
          error={errors.description?.message}
          disabled={disabled}
        />

        <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-500">
          <span className="font-semibold text-neutral-700">Tip: </span>
          The <span className="font-medium text-neutral-700">code</span> must be
          unique within your organisation. Standards are attached to a programme
          once it exists.
        </div>
      </form>
    </Modal>
  );
}
