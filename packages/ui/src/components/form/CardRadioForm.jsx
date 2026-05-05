"use client";

import { CheckCircle2 } from "lucide-react";
import { memo } from "react";
import { Controller } from "react-hook-form";

const CardRadioForm = memo(
  ({
    label,
    name,
    control,
    error,
    required = false,
    options = [],
    disabled = false,
    description,
    layout = "vertical",
    color = "green",
    className = "",
  }) => {
    const layoutClasses = {
      vertical: "flex flex-col gap-3",
      horizontal: "flex flex-wrap gap-3",
      grid: "grid grid-cols-1 sm:grid-cols-2 gap-3",
    };

    const colorSchemes = {
      green: {
        selected: "border-green-600 bg-green-50",
        selectedIcon: "bg-green-600 text-white",
        selectedCheck: "text-green-600",
        hover: "hover:border-green-300",
      },
      blue: {
        selected: "border-blue-600 bg-blue-50",
        selectedIcon: "bg-blue-600 text-white",
        selectedCheck: "text-blue-600",
        hover: "hover:border-blue-300",
      },
      purple: {
        selected: "border-purple-600 bg-purple-50",
        selectedIcon: "bg-purple-600 text-white",
        selectedCheck: "text-purple-600",
        hover: "hover:border-purple-300",
      },
    };

    const colors = colorSchemes[color] || colorSchemes.green;

    return (
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${label || "This field"} is required` : false,
        }}
        render={({ field }) => {
          return (
            <fieldset disabled={disabled} className={`${className}`}>
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
                <p className="text-xs sm:text-sm text-gray-600 mb-1 leading-relaxed">
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
                  const Icon = option.icon;
                  const isSelected = field.value === option.value;
                  const isDisabled = disabled || option.disabled;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!isDisabled) {
                          field.onChange(option.value);
                        }
                      }}
                      disabled={isDisabled}
                      className={`
                                            relative w-full p-4 rounded-xl border-1 
                                            transition-all duration-300 text-left
                                            ${
                                              isDisabled
                                                ? "cursor-not-allowed opacity-60 bg-gray-100 border-gray-200"
                                                : `cursor-pointer ${colors.hover} hover:shadow-md`
                                            }
                                            ${
                                              isSelected
                                                ? `${colors.selected} shadow ${color === "green" ? "ring-green-600/20" : color === "blue" ? "ring-blue-600/20" : "ring-purple-600/20"}`
                                                : "border-gray-200 bg-white"
                                            }
                                        `}
                      aria-checked={isSelected}
                      role="radio"
                      aria-label={option.title}
                      aria-describedby={error ? `${name}-error` : undefined}
                    >
                      <div className="flex items-start gap-3">
                        {Icon && (
                          <div
                            className={`
                                                        p-2 rounded-lg transition-all duration-300
                                                        ${
                                                          isSelected
                                                            ? colors.selectedIcon
                                                            : "bg-gray-100 text-gray-600"
                                                        }
                                                    `}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              className={`
                                                        font-semibold transition-colors duration-300
                                                        ${isSelected ? "text-gray-900" : "text-gray-800"}
                                                    `}
                            >
                              {option.title}
                            </h3>
                            {option.badge && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {option.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {option.description}
                          </p>
                          {option.subtext && (
                            <p className="text-xs text-gray-500 mt-1.5">
                              {option.subtext}
                            </p>
                          )}
                        </div>

                        <div
                          className={`
                                                    flex-shrink-0 transition-all duration-300
                                                    ${
                                                      isSelected
                                                        ? "opacity-100 scale-100 rotate-0"
                                                        : "opacity-0 scale-0 -rotate-180"
                                                    }
                                                `}
                        >
                          <CheckCircle2
                            className={`w-5 h-5 ${colors.selectedCheck}`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && (
                <p
                  id={`${name}-error`}
                  className="mt-2 text-xs text-red-600 font-medium"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <style>{`
                            @keyframes slide-in {
                                from {
                                    transform: scaleY(0);
                                    opacity: 0;
                                }
                                to {
                                    transform: scaleY(1);
                                    opacity: 1;
                                }
                            }
                            .animate-slide-in {
                                animation: slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                                transform-origin: top;
                            }
                        `}</style>
            </fieldset>
          );
        }}
      />
    );
  },
);

CardRadioForm.displayName = "CardRadioForm";
export default CardRadioForm;
