"use client";

import { AlertCircle } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/utils/helper";

// ─── TextareaField ────────────────────────────────────────────────────────────
// Multi-line text input that mirrors InputField's look and react-hook-form API.
export const TextareaField = forwardRef(function TextareaField(
  {
    label,
    name,
    placeholder,
    error,
    required = false,
    disabled = false,
    rows = 4,
    maxLength,
    register,
    ...rest
  },
  ref,
) {
  const registration =
    register?.(name, {
      required: required ? `${label ?? "This field"} is required` : false,
    }) ?? {};

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        aria-required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        placeholder={placeholder}
        className={cn(
          "w-full resize-y rounded-lg border px-3.5 py-2.5 text-sm transition-colors duration-150",
          "bg-white text-gray-900 placeholder:text-gray-400",
          "hover:border-neutral-300 focus:outline-none",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-blue-400",
          disabled && "cursor-not-allowed bg-gray-50 text-gray-400",
        )}
        {...registration}
        {...rest}
      />

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 flex items-start gap-1 text-xs font-normal text-red-600"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
});
TextareaField.displayName = "TextareaField";
