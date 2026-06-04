import { Construction } from "lucide-react";

export function EmptyPage({
  title = "Coming soon",
  description = "This page is under construction.",
}) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Construction aria-hidden="true" className="size-5" />
      </div>
      <div className="max-w-xs text-center">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
