"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { LEVY, STANDARDS } from "./data";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;
const PAYE = /^\d{3}\/[A-Z]{1,2}\d{5}$/;
const DECLS = [
  "I confirm Midlands Engineering Ltd is a registered levy payer",
  "I confirm this transfer is for genuine apprenticeship training",
  "I confirm the receiving organisation is DAS-registered",
  "I understand unused funds revert to my account if the apprentice withdraws",
];

export function NewTransferForm({ prefillAmount, onSuccess }) {
  const [amount, setAmount] = useState(prefillAmount ?? "");
  const [paye, setPaye] = useState("");
  const [das, setDas] = useState(false);
  const [standard, setStandard] = useState("");
  const [checks, setChecks] = useState(DECLS.map(() => false));
  const [sending, setSending] = useState(false);

  const amtNum = Number(amount);
  const amtOk = amtNum >= 1000 && amtNum <= LEVY.remaining;
  const payeOk = PAYE.test(paye);
  const allTicked = checks.every(Boolean);
  const canSubmit = amtOk && payeOk && das && standard && allTicked;
  const selected = STANDARDS.find((s) => s.label === standard);
  const barPct = Math.min(
    100,
    amtNum > 0 ? Math.round((amtNum / LEVY.remaining) * 100) : 0,
  );

  const submit = () => {
    if (!canSubmit || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSuccess?.({ amount: amtNum, standard });
    }, 2500);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <p className="text-sm font-bold" style={{ color: T.ink }}>
          Initiate a new transfer
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          ESFA-compliant transfer to a verified SME
        </p>
      </div>
      <div className="p-5 space-y-5">
        <div className="space-y-2">
          <p
            className="text-[10px] font-bold tracking-wider uppercase"
            style={{ color: T.muted }}
          >
            Receiving Organisation
          </p>
          <input
            type="text"
            placeholder="Company name (search SMEs…)"
            className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
            style={{ borderColor: T.border, color: T.ink }}
          />
          <div>
            <input
              type="text"
              value={paye}
              onChange={(e) => setPaye(e.target.value)}
              placeholder="PAYE reference — e.g. 120/AB12345"
              className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
              style={{
                borderColor: paye && !payeOk ? T.red : T.border,
                color: T.ink,
              }}
            />
            {paye && (
              <p
                className="text-[11px] mt-0.5"
                style={{ color: payeOk ? T.green : T.red }}
              >
                {payeOk ? "✓ Format valid" : "⚠ Invalid PAYE reference format"}
              </p>
            )}
          </div>
          <label
            className="flex items-center gap-2 cursor-pointer text-xs"
            style={{ color: T.ink }}
          >
            <input
              type="checkbox"
              checked={das}
              onChange={(e) => setDas(e.target.checked)}
              style={{ accentColor: T.green }}
            />
            Receiving organisation is registered on DAS
          </label>
        </div>
        <div className="space-y-2">
          <p
            className="text-[10px] font-bold tracking-wider uppercase"
            style={{ color: T.muted }}
          >
            Transfer Details
          </p>
          <div>
            <input
              type="number"
              value={amount}
              min={1000}
              max={LEVY.remaining}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Transfer amount (£)"
              className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none"
              style={{
                borderColor: amount && !amtOk ? T.red : T.border,
                color: T.ink,
              }}
            />
            <div
              className="mt-1.5 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: T.border }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${barPct}%`,
                  backgroundColor: amtOk ? T.green : T.red,
                }}
              />
            </div>
            {amount !== "" && (
              <p
                className="text-[11px] mt-0.5"
                style={{
                  color:
                    amtNum === LEVY.expiring
                      ? T.amber
                      : amtOk
                        ? T.green
                        : T.red,
                }}
              >
                {amtNum === LEVY.expiring
                  ? "💡 This matches your expiring levy amount — good choice"
                  : amtOk
                    ? `✓ ${fmt(LEVY.remaining - amtNum)} remaining after this transfer`
                    : `⚠ Exceeds your remaining transfer allowance of ${fmt(LEVY.remaining)}`}
              </p>
            )}
          </div>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
            style={{
              borderColor: T.border,
              color: standard ? T.ink : T.muted,
              backgroundColor: T.surface,
            }}
          >
            <option value="">Apprenticeship standard…</option>
            {STANDARDS.map((s) => (
              <option key={s.label}>{s.label}</option>
            ))}
          </select>
          {selected && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ backgroundColor: T.card }}
            >
              <span style={{ color: T.muted }}>Funding band:</span>
              <span className="font-bold" style={{ color: T.green }}>
                {fmt(selected.fundingBand)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {["Transfer start date", "Transfer end date"].map((label) => (
              <div key={label}>
                <label
                  className="block text-[10px] font-semibold mb-1"
                  style={{ color: T.muted }}
                >
                  {label}
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none"
                  style={{ borderColor: T.border, color: T.ink }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p
            className="text-[10px] font-bold tracking-wider uppercase"
            style={{ color: T.muted }}
          >
            Declaration
          </p>
          {DECLS.map((d, i) => (
            <label key={i} className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() =>
                  setChecks((c) => c.map((v, j) => (j === i ? !v : v)))
                }
                className="mt-0.5 shrink-0"
                style={{ accentColor: T.green }}
              />
              <span className="text-xs" style={{ color: T.ink }}>
                {d}
              </span>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || sending}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{
            backgroundColor: canSubmit ? T.green : T.border2,
            color: canSubmit ? "#fff" : T.muted,
          }}
        >
          {sending ? "⟳ Submitting to ESFA DAS…" : "Submit transfer request"}
        </button>
      </div>
    </div>
  );
}
