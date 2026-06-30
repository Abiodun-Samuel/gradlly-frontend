"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

const FREQS = ["Daily", "Weekly", "Off"];

export function OTJNotificationDrawer({ onClose }) {
  const [freq, setFreq] = useState("Weekly");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col shadow-2xl w-full sm:w-[400px]"
        style={{
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            OTJ digest settings
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: T.subtle }}
            >
              Digest frequency
            </p>
            <div
              className="inline-flex rounded-xl overflow-hidden"
              style={{ border: `1px solid ${T.border}` }}
            >
              {FREQS.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFreq(f)}
                  className="px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: freq === f ? T.ink : "transparent",
                    color: freq === f ? "#fff" : T.subtle,
                    borderRight:
                      i < FREQS.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <p
              className="text-xs mt-2"
              style={{ color: freq === "Off" ? T.amber : T.muted }}
            >
              {freq === "Weekly" && "Sent every Monday at 08:00 GMT"}
              {freq === "Daily" && "Sent every weekday at 08:00 GMT"}
              {freq === "Off" &&
                "⚠ You will not receive email reminders about pending OTJ approvals"}
            </p>
          </div>

          <div>
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: T.subtle }}
            >
              Email recipient
            </p>
            <input
              type="email"
              defaultValue="sarah.rahman@midlandseng.co.uk"
              className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.card,
              }}
            />
            <button
              type="button"
              className="mt-2 text-xs font-semibold hover:underline"
              style={{ color: T.blue }}
            >
              + Add recipient
            </button>
          </div>

          <div
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: T.muted }}
            >
              Next scheduled digest
            </p>
            <p className="text-xs font-semibold" style={{ color: T.ink }}>
              Monday 07 Apr 2025 · 08:00 GMT
            </p>
          </div>
        </div>
        <div
          className="shrink-0 px-5 py-4"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            onClick={save}
            className="w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {saved ? "✓ Saved" : "Save settings"}
          </button>
        </div>
      </div>
    </>
  );
}
