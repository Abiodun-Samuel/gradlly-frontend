import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

export function OTJEvidenceModal({ entry, onClose }) {
  if (!entry) return null;

  const evidenceKeys = entry.evidence ? Object.keys(entry.evidence) : [];

  return (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "fade-in 200ms ease both" }}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: T.surface,
          animation: "scale-in 200ms ease both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Evidence
            </p>
            {entry.note && (
              <p className="text-xs mt-0.5" style={{ color: T.muted }}>
                {entry.note}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {evidenceKeys.length > 0 ? (
            <div className="space-y-2">
              {evidenceKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: T.card,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <span
                    className="text-xs font-semibold shrink-0"
                    style={{ color: T.subtle }}
                  >
                    {key}
                  </span>
                  <span className="text-xs break-all" style={{ color: T.ink }}>
                    {String(entry.evidence[key])}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="w-full h-32 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: T.card,
                border: `2px dashed ${T.border}`,
              }}
            >
              <p className="text-xs" style={{ color: T.muted }}>
                No evidence data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
