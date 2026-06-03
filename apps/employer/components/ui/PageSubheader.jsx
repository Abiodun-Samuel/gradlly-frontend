import { cn } from "@/utils/helper";

/**
 * PageSubheader
 *
 * Reusable hero / sub-header for dashboard pages. Renders an optional leading
 * icon tile, an eyebrow, a title, a description, and an optional actions slot.
 *
 * @param {object}            props
 * @param {React.ElementType} [props.icon]        lucide icon component
 * @param {string}            [props.eyebrow]     small uppercase label above the title
 * @param {React.ReactNode}   props.title         page title
 * @param {React.ReactNode}   [props.description] supporting copy
 * @param {React.ReactNode}   [props.actions]     right-aligned actions (buttons)
 * @param {React.ReactNode}   [props.children]    extra content below the header row
 * @param {string}            [props.className]
 */
export function PageSubheader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className,
      )}
    >
      {/* Subtle accent wash in the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary-50 opacity-60 blur-2xl"
      />

      <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-sm ring-1 ring-primary-700/10">
              <Icon aria-hidden className="size-5.5" strokeWidth={1.75} />
            </div>
          ) : null}

          <div className="min-w-0">
            {eyebrow ? (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-lg font-bold leading-tight tracking-tight text-neutral-900 sm:text-xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2 sm:self-center">
            {actions}
          </div>
        ) : null}
      </div>

      {children ? (
        <div className="relative border-t border-neutral-100 px-5 py-4 sm:px-6">
          {children}
        </div>
      ) : null}
    </div>
  );
}
