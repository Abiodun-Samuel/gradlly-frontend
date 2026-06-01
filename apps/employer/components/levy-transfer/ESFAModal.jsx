"use client";
import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";

const POINTS = [
  ["Transfer cap", "50% of annual levy (from April 2025, previously 25%)"],
  ["Minimum transfer", "£1,000 per transfer"],
  ["Eligible recipients", "SMEs not paying the apprenticeship levy"],
  ["DAS registration", "Both parties must be registered on the DAS platform"],
  [
    "Standard-tied",
    "All transfers must be tied to a specific standard and funding band",
  ],
  [
    "Withdrawal",
    "Unused funds revert to the donor employer if the apprentice withdraws",
  ],
  ["Expiry", "Transfers expire if undrawn within 24 months of agreement"],
];

export function ESFAModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="ESFA Levy Transfer Policy — 2024/25"
      description="Education & Skills Funding Agency guidance"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
          style={{ borderColor: T.border, color: T.subtle }}
        >
          Close
        </button>
      }
    >
      <div className="space-y-2.5">
        {POINTS.map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl p-3.5 flex gap-3"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5 text-[10px] font-bold"
              style={{ backgroundColor: T.blueLight, color: T.blue }}
            >
              i
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: T.ink }}>
                {k}
              </p>
              <p
                className="text-[11px] mt-0.5 leading-relaxed"
                style={{ color: T.subtle }}
              >
                {v}
              </p>
            </div>
          </div>
        ))}
        <a
          href="https://www.gov.uk/guidance/transfer-levy-funds-to-another-business"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center text-xs font-semibold hover:underline py-2"
          style={{ color: T.blue }}
        >
          View full ESFA guidance on GOV.UK →
        </a>
      </div>
    </Modal>
  );
}
