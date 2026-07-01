"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileCog } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applyServerErrors } from "@/lib/errors";

import { useCreateMappingConfig } from "../queries/ilr.query";
import {
  mappingConfigDefaults,
  mappingConfigSchema,
  toMappingConfigPayload,
} from "../schemas";

/**
 * Create a draft ILR mapping config for an academic year. The config document is
 * entered as raw JSON (compliance-lead tooling).
 */
export function MappingConfigModal({ open, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mappingConfigSchema),
    defaultValues: mappingConfigDefaults,
    mode: "onBlur",
  });

  const {
    mutateAsync,
    isPending,
    error: serverError,
  } = useCreateMappingConfig();
  const disabled = isSubmitting || isPending;

  useEffect(() => {
    if (open) reset(mappingConfigDefaults);
  }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync(toMappingConfigPayload(values));
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
      size="2xl"
      icon={<FileCog className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title="New mapping config"
      description="Create a draft config version for an academic year. Publish it to activate."
      footer={
        <Button
          type="submit"
          form="mapping-config-form"
          color="green"
          size="sm"
          loading={disabled}
          disabled={disabled}
        >
          Create draft
        </Button>
      }
    >
      <form
        id="mapping-config-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <ServerErrorAlert error={serverError} />

        <div className="sm:max-w-xs">
          <InputField
            required
            name="academicYear"
            label="Academic year"
            placeholder="2025-26"
            register={register}
            error={errors.academicYear?.message}
            disabled={disabled}
          />
        </div>

        <TextareaField
          required
          name="configJson"
          label="Config document (JSON)"
          placeholder='{ "academicYear": "2025-26", "entities": { … }, "rules": [ … ] }'
          rows={12}
          register={register}
          error={errors.configJson?.message}
          disabled={disabled}
        />
        <p className="text-xs text-neutral-400">
          Must be a JSON object with <code>entities</code> and{" "}
          <code>rules</code>. Publishing supersedes the current published
          version for the year.
        </p>
      </form>
    </Modal>
  );
}
