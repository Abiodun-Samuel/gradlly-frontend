"use client";
import { Download, Share2, X } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

export function DocumentPanel({ statement, onClose }) {
  const [tab, setTab] = useState("document");
  const { id, apprentice, standard, provider } = statement;
  const parties = [
    { role: "Apprentice", s: statement.apprenticeSigned },
    { role: "Provider", s: statement.providerSigned },
    { role: "Employer", s: statement.employerSigned },
  ];
  const audit = parties
    .filter((p) => p.s?.signed)
    .map((p) => ({
      role: p.role,
      name: p.s.name,
      ts: p.s.timestamp,
      ip: p.s.ip,
    }));

  return (
    <div
      className="fixed inset-0 z-[230] flex justify-end"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="w-full sm:max-w-[560px] h-full flex flex-col"
        style={{
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms var(--ease-out) both",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: T.ink }}>
              Commitment Statement · {id}
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              {apprentice.name} · {standard}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: T.greenLight, color: T.green }}
            >
              ✓ Fully signed
            </span>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <Download className="h-3.5 w-3.5" style={{ color: T.muted }} />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <Share2 className="h-3.5 w-3.5" style={{ color: T.muted }} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <X className="h-4 w-4" style={{ color: T.muted }} />
            </button>
          </div>
        </div>

        <div
          className="flex shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {["document", "audit"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-5 py-2.5 text-xs font-semibold"
              style={{
                color: tab === t ? T.blue : T.subtle,
                borderBottom:
                  tab === t ? `2px solid ${T.blue}` : "2px solid transparent",
              }}
            >
              {t === "audit" ? "Audit Trail" : "Document"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "document" ? (
            <div
              className="rounded-xl p-4 text-xs space-y-3"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <p className="font-bold text-sm" style={{ color: T.ink }}>
                Commitment Statement
              </p>
              <p style={{ color: T.subtle }}>
                {standard} · {provider} · {statement.startDate} –{" "}
                {statement.endDate}
              </p>
              <p style={{ color: T.subtle }}>
                OTJ hours agreed: {statement.otjHoursAgreed} hours (20% minimum)
              </p>
              <hr style={{ borderColor: T.border }} />
              <p className="font-semibold" style={{ color: T.ink }}>
                Employer Responsibilities
              </p>
              <p style={{ color: T.subtle }}>
                Midlands Engineering Ltd agrees to release the apprentice for
                all scheduled training, provide meaningful work aligned to the
                standard, and conduct quarterly progress reviews with the
                provider.
              </p>
              <p className="font-semibold" style={{ color: T.ink }}>
                Off-the-Job Training Plan
              </p>
              <p style={{ color: T.subtle }}>
                Minimum 20% off-the-job — delivered via day release Thursdays +
                structured workplace projects.
              </p>
              <hr style={{ borderColor: T.border }} />
              <div className="grid grid-cols-3 gap-2">
                {parties
                  .filter((p) => p.s?.signed)
                  .map(({ role, s }) => (
                    <div
                      key={role}
                      className="rounded-lg p-2 text-[10px]"
                      style={{ backgroundColor: T.greenLight }}
                    >
                      <p className="font-bold" style={{ color: T.green }}>
                        ✓ {role}
                      </p>
                      <p style={{ color: T.ink }}>{s.name}</p>
                      <p style={{ color: T.muted }}>{s.date}</p>
                    </div>
                  ))}
              </div>
              {/* Version history */}
              <div
                className="mt-4 pt-4"
                style={{ borderTop: `1px solid ${T.border}` }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: T.muted }}
                >
                  Version history
                </p>
                {statement.version > 1 ? (
                  <div
                    className="rounded-lg p-2.5 text-xs"
                    style={{
                      backgroundColor: T.card,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: T.subtle }}>
                        v1 · Signed{" "}
                        {statement.originalSignedDate ?? "05 Mar 2024"} · All
                        parties
                      </span>
                      <button
                        type="button"
                        className="text-[11px] font-semibold hover:underline"
                        style={{ color: T.blue }}
                      >
                        ↓ Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: T.muted }}>
                    This is the original version — no prior versions
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  icon: "📄",
                  color: T.blue,
                  label: "Created",
                  desc: `Statement ${id} created by Sarah Rahman · 27 Dec 2023 · 09:12 GMT`,
                },
                {
                  icon: "✏️",
                  color: T.muted,
                  label: "Draft saved",
                  desc: "Draft updated by Sarah Rahman · 28 Dec 2023 · 11:05 GMT",
                },
                {
                  icon: "📤",
                  color: T.amber,
                  label: "Sent for signing",
                  desc: "Sent to all parties for signing · 28 Dec 2023 · 11:22 GMT",
                },
                ...audit.map((e) => ({
                  icon: "✅",
                  color: T.green,
                  label: `Signed — ${e.role}`,
                  desc: `${e.name} · ${e.ts}${e.ip ? ` · IP: ${e.ip}` : ""}`,
                })),
                {
                  icon: "👁️",
                  color: T.subtle,
                  label: "Viewed",
                  desc: "Document viewed by Sarah Rahman · 15 Jan 2025 · 14:33 GMT",
                },
              ].map((e, i, arr) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-sm mt-0.5">{e.icon}</span>
                    {i < arr.length - 1 && (
                      <span
                        className="w-px flex-1 mt-1"
                        style={{ backgroundColor: T.border }}
                      />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold" style={{ color: e.color }}>
                      {e.label}
                    </p>
                    <p style={{ color: T.muted }}>{e.desc}</p>
                  </div>
                </div>
              ))}
              <p
                className="text-[10px] p-3 rounded-lg"
                style={{ backgroundColor: T.greenLight, color: T.green }}
              >
                This audit trail meets ESFA record-keeping requirements under
                the Apprenticeship Funding Rules 2024/25
              </p>
              <button
                type="button"
                className="text-xs font-semibold hover:opacity-75 transition-opacity"
                style={{ color: T.blue }}
              >
                ↓ Export audit log
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
