"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";
import { toastSuccess } from "@/hooks/useToast";

const DOC = `Employer responsibilities: Midlands Engineering Ltd agrees to release Amara Diallo for all scheduled training days, provide meaningful work relevant to the Accounting Technician standard, conduct quarterly progress reviews with the provider, and ensure the apprentice is not charged for any element of their training.

Provider responsibilities: WMG Academy agrees to deliver the Accounting Technician L4 training programme, track and record all off-the-job training hours, conduct regular progress reviews, prepare the apprentice for end-point assessment, and submit progress data to the ESFA DAS.

Apprentice responsibilities: Amara Diallo agrees to attend all scheduled training sessions, complete and maintain an accurate off-the-job training log, actively engage with progress reviews, and work towards successful completion of the end-point assessment.

OTJ delivery plan: Minimum 20% off-the-job — delivered via day release Thursdays + structured workplace projects.`;

export function SignNowModal({ open, onClose }) {
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);

  const sign = () => {
    if (!agreed) return;
    setSigned(true);
    setTimeout(() => {
      toastSuccess("Commitment statement signed — CS-003");
      onClose();
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Sign commitment statement — Amara Diallo"
      description="Accounting Technician L4 · WMG Academy · CS-003"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={sign}
            disabled={!agreed || signed}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-40"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {signed ? "✓ Signed" : "Apply digital signature"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-xl p-3.5 space-y-1.5"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          {[
            ["Programme", "Accounting Technician L4"],
            ["Provider", "WMG Academy · Sunita Patel"],
            ["Dates", "01 Jan 2024 – 30 Nov 2025"],
            ["OTJ hours", "600 hours (20% minimum)"],
            [
              "Already signed",
              "Sunita Patel · 28 Dec 2023 · Amara Diallo · 27 Dec 2023",
            ],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span
                className="text-[11px] font-semibold w-28 shrink-0"
                style={{ color: T.muted }}
              >
                {k}
              </span>
              <span className="text-[11px]" style={{ color: T.ink }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-3.5 h-40 overflow-y-auto text-[11px] leading-relaxed whitespace-pre-line"
          style={{
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            color: T.subtle,
            fontFamily: "Georgia, serif",
          }}
        >
          {DOC}
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 shrink-0"
            style={{ accentColor: T.blue }}
          />
          <span className="text-xs" style={{ color: T.ink }}>
            I, <strong>Sarah Rahman</strong>, confirm I have read and agree to
            the terms of this commitment statement on behalf of{" "}
            <strong>Midlands Engineering Ltd</strong>
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {[
            ["Full name", "Sarah Rahman"],
            ["Capacity", "Head of L&D"],
          ].map(([label, val]) => (
            <div key={label}>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                {label}
              </label>
              <input
                type="text"
                defaultValue={val}
                className="w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
