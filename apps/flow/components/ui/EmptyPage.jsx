import { Construction } from "lucide-react";
export function EmptyPage({
  title = "Coming soon",
  description = "This page is under construction.",
}) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-2xl border border-(--color-border) bg-surface-0 shadow-xs">
      <div
        className="flex size-12 items-center justify-center rounded-2xl"
        style={{ background: "var(--portal-accent-subtle)" }}
      >
        <Construction
          aria-hidden="true"
          className="size-5"
          style={{ color: "var(--portal-accent)" }}
        />
      </div>
      <div className="max-w-xs text-center">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-xs text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
