import { memo, useState, useEffect } from "react";

const RadioForm = memo(
  ({
    label,
    name,
    register,
    setValue,
    watch,
    error,
    required = false,
    options = [],
    validationRules = {},
    disabled = false,
    description,
    layout = "vertical",
    enableOther = false,
    otherLabel = "Other",
    otherPlaceholder = "Please specify",
    otherMinLength = 2,
    otherRequired = true,
    className = "",
  }) => {
    const [otherValue, setOtherValue] = useState("");
    const currentValue = watch ? watch(name) : null;
    const isOtherSelected = currentValue === "other";

    useEffect(() => {
      if (watch && isOtherSelected) {
        const otherTextValue = watch(`${name}_other_text`);
        if (otherTextValue && otherTextValue !== otherValue) {
          setOtherValue(otherTextValue);
        }
      }
    }, [watch, name, isOtherSelected, otherValue]);

    const validation = {
      required: required ? `${label || name} is required` : false,
      ...validationRules,
    };

    const layoutClasses = {
      vertical: "flex flex-col gap-2.5",
      horizontal: "flex flex-wrap gap-3",
      grid: "grid grid-cols-1 sm:grid-cols-2 gap-3",
    };

    const handleOtherInputChange = (e) => {
      const value = e.target.value;
      setOtherValue(value);

      if (setValue) {
        setValue(`${name}_other_text`, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    const handleOtherInputFocus = () => {
      if (setValue && !isOtherSelected) {
        setValue(name, "other", {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
    };

    const handleOtherInputBlur = () => {
      if (setValue && isOtherSelected) {
        setValue(`${name}_other_text`, otherValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    useEffect(() => {
      if (register && enableOther) {
        register(`${name}_other_text`);
      }
    }, [register, name, enableOther]);

    // const otherFieldError = error || (watch && watch(`${name}_other_text_error`));

    return (
      <fieldset disabled={disabled} className={`mb-6 ${className}`}>
        {label && (
          <legend className="block text-sm font-medium mb-1 text-gray-700">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </legend>
        )}

        {description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div
          className={layoutClasses[layout]}
          role="radiogroup"
          aria-labelledby={label ? `${name}-label` : undefined}
          aria-required={required}
        >
          {options.map((option) => {
            const isDisabled = disabled || option.disabled;

            return (
              <label
                key={option.id}
                className={`
                                group relative flex items-start gap-3 py-2.5 px-4 rounded-lg
                                border-[1.5px] transition-all duration-200 ease-out
                                ${
                                  isDisabled
                                    ? "cursor-not-allowed opacity-60 bg-gray-100 border-gray-200"
                                    : "cursor-pointer hover:border-blue-500"
                                }
                                bg-white border-gray-200
                                has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500
                            `}
              >
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    type="radio"
                    value={option.id}
                    {...(register ? register(name, validation) : {})}
                    disabled={isDisabled}
                    className="sr-only peer"
                    aria-describedby={error ? `${name}-error` : undefined}
                    aria-label={option.name}
                  />

                  <div
                    className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2
                                    flex items-center justify-center
                                    transition-all duration-200 ease-out
                                    border-gray-300 bg-white
                                    peer-checked:border-blue-500 peer-checked:bg-blue-500 
                                    ${!isDisabled && "group-hover:border-blue-500"}
                                `}
                  >
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 ease-out" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold transition-colors duration-200 text-gray-600 peer-has-[:checked]:text-blue-600">
                    {option.name}
                  </div>

                  {option.description && (
                    <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {option.description}
                    </div>
                  )}
                </div>

                <div className="shrink-0 mt-0.5 opacity-0 scale-0 has-[:checked]:opacity-100 has-[:checked]:scale-100 transition-all duration-200">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
            );
          })}

          {enableOther && (
            <div
              className={`
                            group relative rounded-lg border-[1.5px] transition-all duration-200 ease-out
                            ${
                              disabled
                                ? "cursor-not-allowed opacity-60 bg-gray-100 border-gray-200"
                                : "hover:border-blue-500"
                            }
                            bg-white border-gray-200
                            ${
                              isOtherSelected
                                ? "bg-blue-50 border-blue-500"
                                : ""
                            }
                        `}
            >
              <label className="flex items-start gap-3 py-2.5 px-4 cursor-pointer">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input
                    type="radio"
                    value="other"
                    {...(register ? register(name, validation) : {})}
                    disabled={disabled}
                    className="sr-only peer"
                    aria-describedby={error ? `${name}-error` : undefined}
                    aria-label={otherLabel}
                  />

                  <div
                    className={`
                                    w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2
                                    flex items-center justify-center
                                    transition-all duration-200 ease-out
                                    border-gray-300 bg-white
                                    peer-checked:border-blue-500 peer-checked:bg-blue-500 
                                    ${!disabled && "group-hover:border-blue-500"}
                                `}
                  >
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white scale-0 opacity-0 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 ease-out" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold transition-colors duration-200 ${isOtherSelected ? "text-blue-600" : "text-gray-600"}`}
                  >
                    {otherLabel}
                  </div>
                </div>

                {isOtherSelected && (
                  <div className="shrink-0 mt-0.5 animate-scale-in">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </label>

              <div className="px-4 pb-3">
                <input
                  type="text"
                  value={otherValue}
                  onChange={handleOtherInputChange}
                  onFocus={handleOtherInputFocus}
                  onBlur={handleOtherInputBlur}
                  disabled={disabled}
                  className={`
                                    w-full px-4 py-2.5 text-sm rounded-lg
                                    border-[1.5px] transition-all duration-200
                                    bg-white
                                    text-gray-800
                                    placeholder:text-gray-400
                                    ${
                                      isOtherSelected
                                        ? "border-blue-500"
                                        : "border-gray-200"
                                    }
                                    ${
                                      error &&
                                      isOtherSelected &&
                                      !otherValue.trim()
                                        ? "border-red-500"
                                        : ""
                                    }
                                    focus:border-blue-500
                                    focus:outline-none
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                  placeholder={otherPlaceholder}
                  aria-label={`${otherLabel} text input`}
                  aria-required={otherRequired && isOtherSelected}
                  aria-invalid={error && isOtherSelected && !otherValue.trim()}
                />
                {isOtherSelected && (
                  <div className="mt-1.5">
                    {otherValue ? (
                      <p className="text-xs text-gray-600">
                        {otherValue.length} character
                        {otherValue.length !== 1 ? "s" : ""}
                        {otherMinLength > 0 &&
                          otherValue.length < otherMinLength && (
                            <span className="text-amber-600 ml-1">
                              (minimum {otherMinLength} required)
                            </span>
                          )}
                      </p>
                    ) : otherRequired ? (
                      <p className="text-xs text-red-500">
                        This field is required
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Optional</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${name}-error`}
            className="mt-1.5 text-xs text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}

        <style>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
                
                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
      </fieldset>
    );
  },
);

RadioForm.displayName = "RadioForm";
export default RadioForm;
