"use client";

import { AlertCircle, Check, ChevronDown, Search, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

import { cn } from "@/utils/helper";

/**
 * Searchable single-select field. Matches InputField visually and integrates
 * with react-hook-form via register + setValue + value (watch) props.
 *
 * @param {string}   name
 * @param {string}   [label]
 * @param {Array}    options          — [{ value: string, text: string }]
 * @param {function} [register]       — RHF register (for validation)
 * @param {function} [setValue]       — RHF setValue (for value updates)
 * @param {string}   [value]          — controlled value from watch(name)
 * @param {string}   [error]          — field error message
 * @param {string}   [placeholder]
 * @param {boolean}  [required=false]
 * @param {boolean}  [disabled=false]
 * @param {boolean}  [searchable=true]
 * @param {string}   [className]
 */
export const SingleSelectField = memo(function SingleSelectField({
  name,
  label,
  options = [],
  register,
  setValue,
  value = "",
  error,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  searchable = true,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  // Register field with RHF so validation rules are applied
  const { ref: registerRef } = register?.(name, {
    required: required ? `${label ?? "This field"} is required` : false,
  }) ?? { ref: null };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Focus search input when dropdown opens — rAF fires after the browser
  // paints the dropdown into the DOM, so the node is guaranteed to be ready.
  useEffect(() => {
    if (!isOpen || !searchable) return;
    const rafId = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, searchable]);

  const selectedOption = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => o.text.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (option) => {
    setValue?.(name, option.value, { shouldValidate: true });
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setValue?.(name, "", { shouldValidate: true });
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((v) => !v);
  };

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Hidden input so RHF ref attaches for focus-on-error behaviour */}
      <input
        type="hidden"
        name={name}
        ref={registerRef}
        value={value}
        readOnly
      />

      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {/* ── Trigger ─────────────────────────────────────────── */}
        {/*
                    Extra right padding (pr-10) reserves space for the controls
                    overlay so the selected text never slides under the chevron.
                */}
        <button
          type="button"
          id={name}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          onClick={toggleOpen}
          className={cn(
            "w-full flex items-center",
            "text-sm rounded-lg pl-3.5 pr-10 py-2.5 border transition-colors duration-150",
            "bg-white text-left focus:outline-none",
            error
              ? "border-red-400 focus:border-red-500"
              : isOpen
                ? "border-blue-400"
                : "border-gray-200 hover:border-gray-300 focus:border-blue-400",
            disabled &&
              "bg-gray-50 text-gray-400 cursor-not-allowed opacity-70",
          )}
        >
          <span
            className={cn(
              "flex-1 truncate text-sm",
              !selectedOption && "text-gray-400",
            )}
          >
            {selectedOption?.text ?? placeholder}
          </span>
        </button>

        {/* ── Controls overlay ─────────────────────────────────
                    Absolutely positioned over the trigger's right edge.
                    pointer-events-none on the container means clicks on the
                    chevron area fall through to the trigger button.
                    pointer-events-auto on the clear button re-enables events
                    only for that element, and places it in the natural tab
                    order so keyboard users can reach it (WCAG 2.1 SC 2.1.1).
                    The clear <button> is a sibling of the trigger in the DOM,
                    not nested inside it, which is required by the HTML spec.
                */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2.5">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className={cn(
                "pointer-events-auto rounded p-0.5",
                "text-gray-400 transition-colors hover:text-gray-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
              )}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-150",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        </div>

        {/* ── Dropdown ─────────────────────────────────────────── */}
        {isOpen && (
          <div
            className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            role="listbox"
            aria-label={label}
          >
            {searchable && (
              <div className="border-b border-gray-100 p-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                    aria-hidden
                  />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className={cn(
                      "w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm",
                      "bg-white text-gray-900 placeholder:text-gray-400",
                      "transition-colors focus:border-blue-400 focus:outline-none",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto" style={{ maxHeight: "12rem" }}>
              {filtered.length > 0 ? (
                filtered.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2",
                        "px-3.5 py-2.5 text-left text-sm transition-colors duration-100",
                        isSelected
                          ? "bg-primary-50 text-primary-800"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <span className="flex-1 truncate">{option.text}</span>
                      {isSelected && (
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-primary-700"
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  {query ? "No results found" : "No options available"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 flex items-start gap-1 text-xs font-normal text-red-600"
        >
          <AlertCircle className="h-3 w-3 shrink-0 mt-px" aria-hidden="true" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
});

SingleSelectField.displayName = "SingleSelectField";
