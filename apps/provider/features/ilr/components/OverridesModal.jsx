"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useUpdateIlrOverrides } from "../queries/ilr.query";
import {
  overrideRowsFromRecord,
  overridesFormSchema,
  toOverridesPayload,
} from "../schemas";

/**
 * Edit the manual field overrides for an ILR record. Overrides are keyed by
 * "Entity.Field" and take precedence over auto-mapped values (survive rebuilds).
 */
export function OverridesModal({ record, open, onClose }) {
  const defaults = useMemo(() => overrideRowsFromRecord(record), [record]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(overridesFormSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "overrides",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useUpdateIlrOverrides();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync({
        id: record.id,
        manualOverrides: toOverridesPayload(values).manualOverrides,
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
      icon={<Pencil className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="Manual overrides"
      description="Override auto-mapped ILR field values. Keys are Entity.Field (e.g. Learner.ULN)."
      footer={
        <Button
          type="submit"
          form="ilr-overrides-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Save overrides
        </Button>
      }
    >
      <form
        id="ilr-overrides-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <div className="w-2/5">
                <InputField
                  name={`overrides.${index}.key`}
                  placeholder="Learner.ULN"
                  register={register}
                  error={errors.overrides?.[index]?.key?.message}
                  disabled={disabled}
                />
              </div>
              <div className="flex-1">
                <InputField
                  name={`overrides.${index}.value`}
                  placeholder="Value"
                  register={register}
                  error={errors.overrides?.[index]?.value?.message}
                  disabled={disabled}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={disabled || fields.length === 1}
                title="Remove override"
                className="mt-1.5 rounded-lg p-1.5 text-danger-500 transition-colors hover:bg-danger-50 disabled:opacity-40"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          size="xs"
          color="black"
          variant="neutral"
          startIcon={<Plus className="size-3.5" />}
          onClick={() => append({ key: "", value: "" })}
          disabled={disabled}
        >
          Add override
        </Button>

        <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
          Saving returns the record to draft — re-validate afterwards.
        </p>
      </form>
    </Modal>
  );
}
