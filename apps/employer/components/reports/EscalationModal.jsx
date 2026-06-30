"use client";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";

import { OTJ_THRESHOLD } from "./data";

export function EscalationModal({ open, provider, onClose }) {
  const gap = provider ? OTJ_THRESHOLD - provider.pct : 0;
  const body = provider
    ? `Dear ${provider.name} team,\n\nI am writing regarding the current off-the-job training delivery rate of ${provider.pct}% for our learners on programme at ${provider.name}.\n\nESFA guidance recommends a minimum of ${OTJ_THRESHOLD}% OTJ delivery at the mid-point of each programme. We are currently ${gap}% below this threshold, which presents a compliance risk for our learners.\n\nCould we arrange a call to review the delivery plan and agree corrective actions within the next 14 days?\n\nKind regards,\nSarah Rahman\nHead of L&D, Midlands Engineering Ltd`
    : "";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Contact provider${provider ? ` — ${provider.name}` : ""}`}
      description={
        provider
          ? `OTJ: ${provider.pct}% · ${gap}% below the ${OTJ_THRESHOLD}% target`
          : ""
      }
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
            onClick={() => {
              toast.success(`Escalation sent to ${provider?.name}`);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.amber, color: "#fff" }}
          >
            Send escalation email
          </button>
        </>
      }
    >
      {provider && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-3.5"
            style={{
              backgroundColor: T.amberLight,
              border: `1px solid ${T.amber}33`,
            }}
          >
            <p className="text-[11px] font-semibold" style={{ color: T.amber }}>
              ⚠ ESFA guidance requires corrective action when OTJ delivery falls
              below threshold. Learners may be at risk of non-compliance.
            </p>
            <a
              href="https://www.gov.uk/guidance/apprenticeship-funding-rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold hover:underline block mt-1.5"
              style={{ color: T.amber }}
            >
              View ESFA funding rules →
            </a>
          </div>
          <div>
            <label
              className="block text-[10px] font-semibold mb-1.5"
              style={{ color: T.muted }}
            >
              Pre-filled escalation email — edit before sending
            </label>
            <textarea
              rows={9}
              defaultValue={body}
              className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none resize-none leading-relaxed"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.card,
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
