import { CheckCircle, Paperclip } from "lucide-react";

const SUMMARY_ROWS = (form) => [
  { label: "Activity", value: form.note },
  { label: "Category", value: form.category },
  { label: "Date", value: form.loggedDate },
  { label: "Hours", value: `${form.hours}h`, accent: true },
];

export function OTJLogStep3({ form, files }) {
  return (
    <div className="flex flex-col items-center text-center py-2 gap-5">
      <div
        className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center"
        style={{ animation: "slide-up 320ms var(--ease-out) both" }}
      >
        <CheckCircle size={32} className="text-success-600" strokeWidth={1.5} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-neutral-900">
          Session logged!
        </h3>
        <p className="text-base text-neutral-500 mt-1.5 max-w-xs mx-auto">
          Submitted and pending approval from your training provider.
        </p>
      </div>

      <div
        className="w-full rounded-xl bg-neutral-50 border border-neutral-100 p-4 text-left space-y-3"
        style={{ animation: "slide-up 320ms var(--ease-out) 80ms both" }}
      >
        {SUMMARY_ROWS(form).map(({ label, value, accent }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="text-sm text-neutral-400 shrink-0">{label}</span>
            <span
              className={
                accent
                  ? "text-sm font-bold text-primary-700"
                  : "text-sm font-medium text-neutral-700 text-right"
              }
            >
              {value}
            </span>
          </div>
        ))}

        {files?.length > 0 && (
          <div className="flex items-start justify-between gap-4 pt-1 border-t border-neutral-100">
            <span className="text-sm text-neutral-400 shrink-0 flex items-center gap-1.5">
              <Paperclip size={12} /> Evidence
            </span>
            <div className="flex flex-col gap-1 items-end">
              {files.map((f) => (
                <span
                  key={`${f.name}-${f.size}`}
                  className="text-xs font-medium text-neutral-600 bg-white border border-neutral-200 px-2 py-0.5 rounded-md max-w-50 truncate"
                >
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
