"use client";
import { Download, X } from "lucide-react";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";

import { HISTORY } from "./data";

const FMT = {
  PDF: { bg: "#fee2e2", color: "#c0272d" },
  CSV: { bg: T.greenLight, color: T.green },
  XLSX: { bg: T.blueLight, color: T.blue },
};

export function ReportHistoryDrawer({ onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 480,
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Report history
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              Previously generated — Midlands Engineering Ltd
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

        <div className="flex-1 overflow-y-auto">
          {HISTORY.map((h, i) => {
            const fm = FMT[h.format] ?? FMT.PDF;
            return (
              <div
                key={h.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  animation: `slide-up 200ms var(--ease-out) ${i * 50}ms both`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = T.card)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: T.ink }}>
                    {h.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                    {h.date} · {h.size}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: fm.bg, color: fm.color }}
                >
                  {h.format}
                </span>
                <button
                  type="button"
                  onClick={() => toast.success(`${h.title} downloaded`)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline shrink-0"
                  style={{ color: T.blue }}
                >
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            );
          })}
        </div>

        <div
          className="p-4 shrink-0"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            onClick={() => toast.success("All reports exported as ZIP")}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Export all reports (ZIP)
          </button>
        </div>
      </div>
    </>
  );
}
