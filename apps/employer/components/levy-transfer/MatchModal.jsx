"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";

import { LEVY } from "./data";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;
const DECLS = [
  "I confirm Midlands Engineering Ltd is a registered levy payer on DAS",
  "I confirm this transfer is for genuine apprenticeship training",
  "I confirm the receiving organisation is registered on DAS",
];

export function MatchModal({ open, sme, onClose, onSuccess }) {
  const [amount, setAmount] = useState(sme?.fundingNeeded ?? 0);
  const [checks, setChecks] = useState([false, false, false]);
  const [sending, setSending] = useState(false);
  const toggle = (i) => setChecks((c) => c.map((v, j) => (j === i ? !v : v)));
  const maxAmt = Math.min(LEVY.remaining, sme?.fundingNeeded ?? 0);
  const amtOk = amount >= 1000 && amount <= maxAmt;
  const allTicked = checks.every(Boolean);
  const canSend = amtOk && allTicked && !sending;

  const send = () => {
    if (!canSend) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSuccess(sme);
    }, 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Request levy transfer match"
      description={sme ? `${sme.name} · ${sme.sector}` : ""}
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
            onClick={send}
            disabled={!canSend}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-40"
            style={{
              backgroundColor: allTicked && amtOk ? T.blue : T.border2,
              color: allTicked && amtOk ? "#fff" : T.muted,
            }}
          >
            {sending ? "⟳ Submitting to ESFA DAS…" : "Send match request"}
          </button>
        </>
      }
    >
      {sme && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-3.5 space-y-1.5"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            {[
              ["Organisation", sme.name],
              ["Sector", `${sme.sector} · ${sme.location}`],
              ["Standard", sme.standard],
              ["Funding needed", fmt(sme.fundingNeeded)],
              ["DAS reference", sme.dasRef],
              [
                "Verification",
                sme.learnfloVerified ? "✓ Learnflo verified" : "⚠ Pending",
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

          <div className="space-y-3">
            <div>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                Transfer amount (£)
              </label>
              <input
                type="number"
                value={amount}
                min={1000}
                max={maxAmt}
                onChange={(e) => setAmount(+e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none"
                style={{
                  borderColor: amtOk ? T.border : T.red,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              />
              <p
                className="text-[11px] mt-0.5"
                style={{ color: amtOk ? T.green : T.red }}
              >
                {amtOk
                  ? `✓ Within your remaining allowance of ${fmt(LEVY.remaining)}`
                  : "⚠ Exceeds remaining allowance"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Planned start date", "date"],
                ["PAYE reference", "text"],
              ].map(([label, type], i) => (
                <div key={label}>
                  <label
                    className="block text-[10px] font-semibold mb-1"
                    style={{ color: T.muted }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    defaultValue={i === 1 ? (sme.payeRef ?? "") : ""}
                    placeholder={i === 1 ? "e.g. 120/AB12345" : ""}
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

          <div className="space-y-2.5">
            {DECLS.map((d, i) => (
              <label
                key={i}
                className="flex items-start gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() => toggle(i)}
                  className="mt-0.5 shrink-0"
                  style={{ accentColor: T.blue }}
                />
                <span className="text-xs" style={{ color: T.ink }}>
                  {d}
                </span>
              </label>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                ["Name", "Sarah Rahman"],
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
        </div>
      )}
    </Modal>
  );
}
