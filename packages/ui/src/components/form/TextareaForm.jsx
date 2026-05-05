"use client";

import { memo } from "react";

const TextareaForm = memo(
  ({
    label,
    name,
    register = () => {},
    error,
    placeholder,
    required = false,
    disabled = false,

    /* ===== textarea-specific props ===== */
    rows = 4,
    cols,
    minLength,
    maxLength,
    resize = "vertical", // 'none' | 'both' | 'horizontal' | 'vertical'
  }) => {
    const getTextareaStyles = () => {
      const base = `
        w-full text-sm font-normal rounded-lg px-4 py-2.5
        transition-all duration-200
        bg-white text-gray-900 placeholder:text-gray-400
        border-[1.5px] focus:outline-none
      `;

      const state = error
        ? "border-red-500 focus:border-red-600"
        : "border-gray-200 focus:border-blue-500";

      const disabledStyles = disabled
        ? "bg-gray-100 cursor-not-allowed opacity-60"
        : "";

      const resizeStyle = {
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
      }[resize];

      return `${base} ${state} ${disabledStyles} ${resizeStyle}`.trim();
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          id={name}
          rows={rows}
          cols={cols}
          minLength={minLength}
          maxLength={maxLength}
          readOnly={disabled}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={getTextareaStyles()}
          {...register(name, {
            required: required ? `${label || "This field"} is required` : false,
            minLength,
            maxLength,
          })}
        />

        {error && (
          <p
            id={`${name}-error`}
            className="mt-0 text-xs text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextareaForm.displayName = "TextareaForm";

export default TextareaForm;
