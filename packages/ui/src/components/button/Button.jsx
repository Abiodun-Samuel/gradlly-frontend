import React from "react";

const variantClasses = {
  primary:
    "bg-[color:var(--portal-accent)] text-[color:var(--portal-accent-fg)] hover:opacity-90 focus-visible:ring-[color:var(--portal-accent)]",
  secondary:
    "bg-surface-2 text-gray-900 hover:bg-surface-3 focus-visible:ring-gray-400 border border-surface-3",
  ghost:
    "bg-transparent text-gray-700 hover:bg-surface-2 focus-visible:ring-gray-400",
  destructive: "bg-error text-white hover:opacity-90 focus-visible:ring-error",
  outline:
    "bg-transparent border border-[color:var(--portal-accent)] text-[color:var(--portal-accent)] hover:bg-[color:var(--portal-accent)] hover:text-[color:var(--portal-accent-fg)]",
};

const sizeClasses = {
  xs: "h-7  px-2.5 text-xs  gap-1",
  sm: "h-8  px-3   text-sm  gap-1.5",
  md: "h-9  px-4   text-sm  gap-2",
  lg: "h-11 px-5   text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}) {
  const isDisabled = disabled ?? loading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium",
        "transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : leftIcon !== null && leftIcon !== undefined ? (
        <span aria-hidden="true">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon !== null && rightIcon !== undefined ? (
        <span aria-hidden="true">{rightIcon}</span>
      ) : null}
    </button>
  );
}
