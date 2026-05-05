import { memo } from "react";
import { Controller } from "react-hook-form";

const SwitchForm = memo(
  ({
    label,
    name,
    control, // Changed from register to control
    error,
    required = false,
    disabled = false,
    defaultValue = false,
    color = "green",
    description,
    className = "",
  }) => {
    // Color configurations
    const getSwitchColors = (isChecked) => {
      if (color === "green") {
        return {
          background: isChecked
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : "bg-gray-200",
          track: isChecked
            ? "shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]"
            : "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
          knob: isChecked
            ? "bg-white shadow-[0_2px_8px_rgba(34,197,94,0.4),0_0_0_1px_rgba(255,255,255,0.1)]"
            : "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]",
          glow: isChecked
            ? "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-green-400 before:to-emerald-500 before:opacity-20 before:blur-md"
            : "",
          innerGlow: isChecked
            ? "bg-gradient-to-br from-green-400 to-emerald-600 opacity-60 blur-[2px]"
            : "bg-gray-300 opacity-0",
        };
      } else if (color === "blue") {
        return {
          background: isChecked
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "bg-gray-200",
          track: isChecked
            ? "shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]"
            : "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
          knob: isChecked
            ? "bg-white shadow-[0_2px_8px_rgba(99,102,241,0.4),0_0_0_1px_rgba(255,255,255,0.1)]"
            : "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]",
          glow: isChecked
            ? "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-blue-400 before:to-indigo-500 before:opacity-20 before:blur-md"
            : "",
          innerGlow: isChecked
            ? "bg-gradient-to-br from-blue-400 to-indigo-600 opacity-60 blur-[2px]"
            : "bg-gray-300 opacity-0",
        };
      } else {
        return {
          background: isChecked
            ? "bg-gradient-to-r from-gray-700 to-gray-900"
            : "bg-gray-200",
          track: isChecked
            ? "shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
            : "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
          knob: isChecked
            ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)]"
            : "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]",
          glow: isChecked
            ? "before:absolute before:inset-0 before:rounded-full before:bg-gray-400 before:opacity-10 before:blur-md"
            : "",
          innerGlow: isChecked
            ? "bg-gray-400 opacity-10 blur-[2px]"
            : "bg-gray-300 opacity-0",
        };
      }
    };

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: required ? `${label || "This field"} is required` : false,
        }}
        render={({ field }) => {
          const isChecked = Boolean(field.value);
          const switchColors = getSwitchColors(isChecked);

          return (
            <div className={`${className}`}>
              <label
                className={`flex flex-wrap items-start gap-5 cursor-pointer select-none ${
                  disabled ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? `${name}-error` : undefined}
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disabled) {
                      const newValue = !field.value;
                      field.onChange(newValue);
                    }
                  }}
                  className={`group relative inline-flex h-7 w-12 shrink-0 rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 ml-4 ${
                    disabled
                      ? "cursor-not-allowed"
                      : "hover:scale-105 active:scale-95"
                  } ${switchColors.background} ${switchColors.track} ${switchColors.glow}`}
                >
                  {""}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full ring-0 transition-all duration-300 ease-out ${
                      isChecked
                        ? "translate-x-6 rotate-180"
                        : "translate-x-1 rotate-0"
                    } ${switchColors.knob} ${
                      isChecked ? "mt-1 scale-110" : "mt-1 scale-100"
                    } ${disabled ? "" : "group-hover:scale-110 group-active:scale-95"}`}
                  >
                    {/* Inner glow dot */}
                    <span
                      className={`absolute inset-0 m-auto h-1.5 w-1.5 rounded-full transition-all duration-300 ${switchColors.innerGlow}`}
                    />
                  </span>
                </button>

                <div className="flex-1">
                  {label && (
                    <span className="block text-sm font-medium mb-1 text-gray-700">
                      {label}
                      {required && (
                        <span
                          className="text-red-500 ml-1"
                          aria-label="required"
                        >
                          *
                        </span>
                      )}
                    </span>
                  )}
                  {description && (
                    <span className="block text-xs text-gray-600 mb-2">
                      {description}
                    </span>
                  )}
                </div>
              </label>

              {error && (
                <p
                  id={`${name}-error`}
                  className="mt-1.5 text-xs text-red-600 font-medium"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          );
        }}
      />
    );
  },
);

SwitchForm.displayName = "SwitchForm";
export default SwitchForm;
