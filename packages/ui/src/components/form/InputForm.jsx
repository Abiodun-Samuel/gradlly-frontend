"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function InputForm({
  label,
  name,
  type = "text",
  register = () => {},
  error,
  placeholder,
  required = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const getInputStyles = () => {
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

    const passwordPadding = type === "password" && !disabled ? "pr-11" : "";

    return `${base} ${state} ${disabledStyles} ${passwordPadding}`.trim();
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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

      <div className="relative">
        <input
          id={name}
          type={inputType}
          {...register(name, {
            required: required ? `${label || "This field"} is required` : false,
          })}
          readOnly={disabled}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={getInputStyles()}
          placeholder={placeholder}
        />

        {type === "password" && !disabled && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute p-1 transition-colors -translate-y-1/2 rounded-md right-2 top-1/2 hover:bg-gray-100 focus:outline-none"
          >
            {showPassword ? (
              <Eye className="w-4 h-4 text-gray-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-xs text-red-600 font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// InputForm.displayName = 'InputForm';

// export default InputForm;
