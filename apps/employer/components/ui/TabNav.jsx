"use client";

import { cn } from "@/utils/helper";

/**
 * TabNav
 *
 * Reusable, fully responsive tab navigation.
 *   - Horizontal segmented strip on small screens.
 *   - Vertical rail on large screens (lg+), with an active pill.
 *
 * Controlled component: the parent owns the active value and the change handler,
 * so tabs can be backed by a route, query param, or local state.
 *
 * Tab shape:
 *   { value: string, label: string, icon?: ElementType, disabled?: boolean, badge?: ReactNode }
 *
 * @param {object}   props
 * @param {Array}    props.tabs
 * @param {string}   props.value             active tab value
 * @param {Function} props.onChange          (value:string) => void
 * @param {string}   [props.ariaLabel]
 * @param {string}   [props.className]
 */
export function TabNav({
  tabs = [],
  value,
  onChange,
  ariaLabel = "Tabs",
  className,
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "flex gap-1.5 overflow-x-auto p-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-0",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            disabled={tab.disabled}
            aria-current={active ? "page" : undefined}
            onClick={() => !tab.disabled && onChange?.(tab.value)}
            className={cn(
              "group relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium",
              "transition-all duration-200 ease-out lg:w-full",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-1",
              tab.disabled && "cursor-not-allowed opacity-50",
              active
                ? "bg-primary-700 text-white shadow-sm shadow-primary-700/20"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            {Icon ? (
              <Icon
                aria-hidden
                strokeWidth={1.85}
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  active
                    ? "text-white"
                    : "text-neutral-400 group-hover:text-neutral-600",
                )}
              />
            ) : null}
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.badge ? (
              <span
                className={cn(
                  "ml-auto hidden items-center justify-center rounded-full px-1.5 text-[10px] font-bold lg:inline-flex",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200 text-neutral-600",
                )}
              >
                {tab.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
