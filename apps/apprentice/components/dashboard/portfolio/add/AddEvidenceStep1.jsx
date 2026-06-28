"use client";

import { useWatch } from "react-hook-form";

import { InputField } from "@/components/form/InputField";
import { FileUpload } from "@/components/ui/FileUpload";
import { cn } from "@/utils/helper";

const ENTRY_TYPES = [
  { value: "file", label: "File upload" },
  { value: "link", label: "Link / URL" },
  { value: "text", label: "Text entry" },
];

const TEXTAREA =
  "w-full text-sm rounded-lg border border-neutral-200 px-3 py-2.5 text-neutral-800 " +
  "placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 " +
  "focus:ring-primary-200 focus:border-primary-400 transition-colors resize-none";

export function AddEvidenceStep1({
  register,
  errors,
  control,
  setValue,
  uploads,
  onAddFiles,
  onRemoveFile,
  onRetryFile,
}) {
  const typeValue = useWatch({ control, name: "type" });

  return (
    <div className="space-y-4">
      {/* Entry type */}
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Entry type <span className="text-danger-500">*</span>
        </label>
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
          {ENTRY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() =>
                setValue("type", t.value, { shouldValidate: true })
              }
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors",
                typeValue === t.value
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <InputField
        name="title"
        label="Title"
        placeholder="e.g. Inventory API — pagination & error handling"
        register={register}
        error={errors.title?.message}
        required
        autoFocus
      />

      {/* Type-specific content */}
      {typeValue === "file" && (
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Files{" "}
            <span className="text-neutral-400">
              (optional · max 25 MB each)
            </span>
          </label>
          <FileUpload
            uploads={uploads}
            onAddFiles={onAddFiles}
            onRemoveFile={onRemoveFile}
            onRetryFile={onRetryFile}
            maxFiles={1}
            maxSizeMb={25}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.zip,.txt,.md"
            hint="PDF, Word, Excel, images · max 25 MB"
          />
        </div>
      )}

      {typeValue === "link" && (
        <InputField
          name="url"
          label="URL"
          type="url"
          placeholder="https://github.com/your-repo or https://..."
          register={register}
          error={errors.url?.message}
          required
        />
      )}

      {typeValue === "text" && (
        <div>
          <label className="text-xs font-medium text-neutral-600 block mb-1.5">
            Your entry <span className="text-danger-500">*</span>
          </label>
          <textarea
            rows={6}
            placeholder="Describe what you did, what you learned, and how it demonstrates your KSBs..."
            className={TEXTAREA}
            {...register("text")}
          />
          {errors.text?.message && (
            <p className="mt-1 text-xs text-red-600">{errors.text.message}</p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1.5">
          Notes{" "}
          <span className="text-neutral-400">
            (optional · context for your tutor)
          </span>
        </label>
        <textarea
          rows={2}
          placeholder="Your role, the decisions you made, or the outcome..."
          className={TEXTAREA}
          {...register("notes")}
        />
      </div>
    </div>
  );
}
