"use client";

import { cn } from "@/utils/helper";

const TYPE_LABEL = {
  file: "File upload",
  link: "Link / URL",
  text: "Text entry",
};

export function AddEvidenceStep3({ values, uploads, declared, setDeclared }) {
  const fileCount = uploads.filter((u) => u.status === "done").length;

  const ROWS = [
    { label: "Title", value: values.title || "—" },
    { label: "Type", value: TYPE_LABEL[values.type] ?? "—" },
    ...(values.type === "file"
      ? [
          {
            label: "Files",
            value:
              fileCount > 0
                ? `${fileCount} file${fileCount !== 1 ? "s" : ""} uploaded`
                : "No files attached",
          },
        ]
      : []),
    ...(values.type === "link"
      ? [{ label: "URL", value: values.url || "—" }]
      : []),
    ...(values.type === "text"
      ? [
          {
            label: "Entry",
            value: values.text
              ? `${values.text.slice(0, 100)}${values.text.length > 100 ? "…" : ""}`
              : "—",
          },
        ]
      : []),
    ...(values.notes ? [{ label: "Notes", value: values.notes }] : []),
  ];

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4 space-y-2.5">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-xs text-neutral-400 shrink-0">{label}</span>
            <span className="text-xs font-medium text-neutral-700 text-right break-all">
              {value}
            </span>
          </div>
        ))}
        {values.ksbDefinitionIds?.length > 0 && (
          <div className="flex items-start gap-4 pt-2 border-t border-neutral-100">
            <span className="text-xs text-neutral-400 shrink-0">KSBs</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {values.ksbDefinitionIds.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Declaration */}
      <div
        className={cn(
          "p-4 rounded-xl border transition-colors",
          declared
            ? "bg-primary-50 border-primary-200"
            : "bg-neutral-50 border-neutral-200",
        )}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="mt-0.5 accent-primary-600 shrink-0"
          />
          <span className="text-xs text-neutral-700 leading-relaxed">
            I confirm this is my own work and accurately represents my skills
            and knowledge.
          </span>
        </label>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed">
        Submitted as{" "}
        <strong className="text-warning-600">⏳ Pending review</strong>. Your
        tutor will review within 5 working days.
      </p>
    </div>
  );
}
