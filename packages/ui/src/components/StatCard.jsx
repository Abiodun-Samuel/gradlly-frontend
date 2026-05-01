import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendConfig = {
  up: { Icon: TrendingUp, cls: "text-emerald-500" },
  down: { TrendingDown, Icon: TrendingDown, cls: "text-red-500" },
  flat: { Icon: Minus, cls: "text-slate-400" },
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  trendLabel,
}) {
  const tc = trendConfig[trend];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-0)] p-5 shadow-[var(--shadow-xs)] transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--portal-accent-subtle), transparent)",
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {label}
          </p>
          <p className="mt-2.5 text-2xl font-bold leading-none text-[var(--color-text-primary)]">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            {tc && (
              <tc.Icon
                aria-hidden="true"
                className={`size-3.5 shrink-0 ${tc.cls}`}
              />
            )}
            <p className="text-xs text-[var(--color-text-secondary)]">
              {trendLabel ?? hint}
            </p>
          </div>
        </div>

        {Icon && (
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--portal-accent-subtle)" }}
          >
            <Icon
              aria-hidden="true"
              className="size-5"
              style={{ color: "var(--portal-accent)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
