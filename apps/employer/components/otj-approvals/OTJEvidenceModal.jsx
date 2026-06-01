import { X } from "lucide-react";

import { T } from "@/components/dashboard/levy/tokens";

export function OTJEvidenceModal({ entry, onClose }) {
  if (!entry) return null;
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
              Evidence — {entry.apprentice}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {entry.activity}
            </p>
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
          <div
            className="w-full h-56 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: T.card,
              border: `2px dashed ${T.border}`,
            }}
          >
            <div className="text-center">
              <p className="text-3xl mb-2">📎</p>
              <p className="text-sm font-semibold" style={{ color: T.ink }}>
                day-release-notes-20-mar.pdf
              </p>
              <p className="text-xs mt-1" style={{ color: T.muted }}>
                Preview unavailable
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full mt-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blueLight, color: "#1847d4" }}
          >
            ↓ Download full PDF
          </button>
        </div>
      </div>
    </div>
  );
}
