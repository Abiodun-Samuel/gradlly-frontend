"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListChecks, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { KSB_KIND_OPTIONS } from "../constants";
import {
  useCreateKsbDefinition,
  useUpdateKsbDefinition,
} from "../queries/portfolio.query";
import {
  ksbDefinitionDefaults,
  ksbDefinitionDefaultsFromRow,
  ksbDefinitionSchema,
  toKsbDefinitionPayload,
} from "../schemas";

/**
 * Create / edit a KSB definition on a standard. One form for both (DRY).
 *
 * @param {string}  standardId   required for create
 * @param {object}  [definition] the row to edit (omit for create)
 */
export function KsbDefinitionFormModal({
  open,
  onClose,
  standardId,
  definition = null,
}) {
  const isEdit = Boolean(definition);

  const defaults = useMemo(
    () =>
      isEdit ? ksbDefinitionDefaultsFromRow(definition) : ksbDefinitionDefaults,
    [isEdit, definition],
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
    resolver: zodResolver(ksbDefinitionSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const kindValue = useWatch({ control, name: "kind" });

  const create = useCreateKsbDefinition();
  const update = useUpdateKsbDefinition();
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
    const payload = toKsbDefinitionPayload(values);
    try {
      if (isEdit) {
        await mutateAsync({ id: definition.id, payload });
      } else {
        await mutateAsync({ standardId, payload });
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
      icon={<ListChecks className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={isEdit ? "Edit KSB" : "Add KSB"}
      description="A Knowledge, Skill or Behaviour that evidence maps to."
      footer={
        <Button
          type="submit"
          form="ksb-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
          startIcon={
            isEdit ? (
              <Save className="size-4" />
            ) : (
              <ListChecks className="size-4" />
            )
          }
        >
          {isEdit ? "Save changes" : "Add KSB"}
        </Button>
      }
    >
      <form
        id="ksb-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputField
            required
            name="code"
            label="Code"
            placeholder="K1"
            register={register}
            error={errors.code?.message}
            disabled={disabled}
          />
          <SingleSelectField
            required
            name="kind"
            label="Kind"
            options={KSB_KIND_OPTIONS}
            register={register}
            setValue={setValue}
            value={kindValue}
            error={errors.kind?.message}
            placeholder="Select a kind"
            searchable={false}
            disabled={disabled}
          />
          <InputField
            name="sortOrder"
            label="Sort order"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            placeholder="0"
            register={register}
            error={errors.sortOrder?.message}
            disabled={disabled}
          />
        </div>

        <InputField
          required
          name="title"
          label="Title"
          placeholder="Understands the principles of…"
          register={register}
          error={errors.title?.message}
          disabled={disabled}
        />

        <TextareaField
          name="description"
          label="Description"
          rows={3}
          maxLength={2000}
          register={register}
          error={errors.description?.message}
          disabled={disabled}
        />
      </form>
    </Modal>
  );
}
