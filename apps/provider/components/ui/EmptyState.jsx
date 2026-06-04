import { Inbox } from "lucide-react";

import { cn } from "@/utils/helper";

/**
 * EmptyState
 *
 * Reusable "no content yet" placeholder for lists, tables, panels and pages.
 *
 * @param {object}            props
 * @param {React.ElementType} [props.icon=Inbox]   lucide icon component
 * @param {React.ReactNode}   props.title          headline
 * @param {React.ReactNode}   [props.description]  supporting copy
 * @param {React.ReactNode}   [props.action]       call-to-action (e.g. a button)
 * @param {boolean}           [props.compact]      tighter vertical padding
 * @param {string}            [props.className]
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  compact = false,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 text-center",
        compact ? "py-10" : "py-16",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Icon className="size-6.5" strokeWidth={1.5} aria-hidden />
      </div>

      <div className="space-y-1">
        {title ? (
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
        ) : null}
        {description ? (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
