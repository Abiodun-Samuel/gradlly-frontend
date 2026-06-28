"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

const fmt = (n) => `£${n.toLocaleString("en-GB")}`;
const TABS = ["Overview", "Apprenticeship", "Verification"];

function Overview({ sme }) {
  return (
    <>
      <p className="text-xs leading-relaxed" style={{ color: T.subtle }}>
        {sme.description}
      </p>
      <div
        className="rounded-xl p-3.5 space-y-1.5 mt-3"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        {[
          ["Employees", sme.employees],
          ["Location", sme.location],
          ["DAS registered", sme.dasRegistered ? "Yes" : "No"],
          ["PAYE ref", sme.learnfloVerified ? sme.payeRef : "●●●●●●"],
          ["Contact", sme.contact.name],
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
        <div className="flex gap-2">
          <span
            className="text-[11px] font-semibold w-28 shrink-0"
            style={{ color: T.muted }}
          >
            Email
          </span>
          <a
            href={`mailto:${sme.contact.email}`}
            className="text-[11px] hover:underline"
            style={{ color: T.blue }}
          >
            {sme.contact.email}
          </a>
        </div>
      </div>
      <div
        className="rounded-xl p-3.5 mt-3"
        style={{ backgroundColor: T.blueLight }}
      >
        <p className="text-[11px] font-semibold" style={{ color: T.muted }}>
          Funding needed
        </p>
        <p className="text-2xl font-extrabold mt-0.5" style={{ color: T.blue }}>
          {fmt(sme.fundingNeeded)}
        </p>
        <p className="text-[11px] mt-1" style={{ color: T.subtle }}>
          {sme.matchReason}
        </p>
      </div>
    </>
  );
}

function Apprenticeship({ sme }) {
  return (
    <div className="space-y-0">
      {[
        ["Standard", sme.standard],
        ["Planned apprentices", sme.apprenticesPlanned],
        ["Proposed provider", sme.proposedProvider ?? "TBC"],
        ["Expected start", sme.expectedStart],
        ["Funding band", `${fmt(sme.fundingBand)} per apprentice`],
      ].map(([k, v]) => (
        <div
          key={k}
          className="flex gap-2 py-2.5"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <span
            className="text-xs font-semibold w-36 shrink-0"
            style={{ color: T.muted }}
          >
            {k}
          </span>
          <span className="text-xs" style={{ color: T.ink }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function Verification({ sme }) {
  const checks = [
    { label: "DAS registered", ok: sme.dasRegistered },
    { label: "PAYE reference verified", ok: sme.learnfloVerified },
    { label: "Credit check passed", ok: sme.learnfloVerified },
    { label: `Prior transfer record (${sme.priorTransfers})`, ok: true },
  ];
  return (
    <div className="space-y-3">
      {checks.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-2.5 text-xs">
          <span>{ok ? "✅" : "⚠️"}</span>
          <span style={{ color: T.ink }}>{label}</span>
        </div>
      ))}
      {sme.verificationDate && (
        <p className="text-[11px]" style={{ color: T.muted }}>
          Verified by Learnflo: {sme.verificationDate}
        </p>
      )}
      <p
        className="text-[11px] p-3 rounded-lg"
        style={{ backgroundColor: T.greenLight, color: T.green }}
      >
        ESFA compliant — eligible to receive levy transfer funds under the
        2024/25 rules.
      </p>
    </div>
  );
}

export function SMEProfilePanel({ sme, onClose, onRequestMatch }) {
  const [tab, setTab] = useState("Overview");
  if (!sme) return null;
  const R = 20,
    C = +(2 * Math.PI * R).toFixed(2),
    fill = +((sme.matchScore / 100) * C).toFixed(2);
  const scoreColor =
    sme.matchScore >= 80 ? T.green : sme.matchScore >= 50 ? T.amber : T.red;
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
          className="flex items-start gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl shrink-0"
            style={{ backgroundColor: T.blueLight }}
          >
            {sme.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base" style={{ color: T.ink }}>
              {sme.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {sme.sector} · {sme.location}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg
                width="44"
                height="44"
                viewBox="0 0 52 52"
                style={{ transform: "rotate(-90deg)", position: "absolute" }}
              >
                <circle
                  cx="26"
                  cy="26"
                  r={R}
                  fill="none"
                  stroke={T.border}
                  strokeWidth="4.5"
                />
                <circle
                  cx="26"
                  cy="26"
                  r={R}
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="4.5"
                  strokeDasharray={`${fill} ${C}`}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-xs font-bold relative z-10"
                style={{ color: scoreColor }}
              >
                {sme.matchScore}
              </span>
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
        </div>
        <div
          className="flex shrink-0 px-5"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors duration-150"
              style={{
                color: tab === t ? T.blue : T.muted,
                borderColor: tab === t ? T.blue : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          className="flex-1 overflow-y-auto p-5"
          style={{ animation: "fade-in 200ms ease both" }}
        >
          {tab === "Overview" && <Overview sme={sme} />}
          {tab === "Apprenticeship" && <Apprenticeship sme={sme} />}
          {tab === "Verification" && <Verification sme={sme} />}
        </div>
        <div
          className="p-4 shrink-0"
          style={{ borderTop: `1px solid ${T.border}` }}
        >
          <button
            type="button"
            onClick={() => onRequestMatch(sme)}
            className="w-full py-2.5 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            Request match
          </button>
        </div>
      </div>
    </>
  );
}
