"use client";

import { Bell, Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { useApprenticeRoster } from "@/features/apprentices/queries/apprentices.query";
import { useCommitmentStatements } from "@/features/commitments/queries/commitments.query";

import { CommitmentList } from "./CommitmentList";
import { CommitmentStatCards } from "./CommitmentStatCards";
import { CommitmentToolbar } from "./CommitmentToolbar";
import { ComplianceBanner } from "./ComplianceBanner";
import { DocumentPanel } from "./DocumentPanel";
import { DraftDrawer } from "./DraftDrawer";
import { SigningAlert } from "./SigningAlert";
import { SignNowModal } from "./SignNowModal";

// ─── Status normaliser ────────────────────────────────────────────────────────

function mapStatus(apiStatus) {
  switch (apiStatus) {
    case "submitted":
    case "awaiting_signatures":
      return "pending_employer";
    case "superseded":
      return "renewal";
    default:
      return apiStatus; // draft | signed | cancelled
  }
}

function normalizeStatement(cs, rosterById) {
  const apprenticeData = rosterById[cs.apprenticeId];
  const uiStatus = mapStatus(cs.status);
  const isSigned = cs.status === "signed";
  const hasApprenticeSigned = ["awaiting_signatures", "signed"].includes(
    cs.status,
  );

  return {
    id: cs.id,
    groupId: cs.groupId,
    enrolmentId: cs.enrolmentId,
    apprenticeId: cs.apprenticeId,
    apprentice: {
      id: cs.apprenticeId,
      name: apprenticeData?.name ?? "—",
      initials: apprenticeData?.initials ?? "?",
      avatarColor: apprenticeData?.avatarColor ?? "#6b7280",
    },
    standard: "—",
    provider: "—",
    startDate: "—",
    status: uiStatus,
    version: cs.version ?? 1,
    needsRenewal: cs.status === "superseded",
    content: cs.content,
    employerSigned: { signed: isSigned, name: null, date: null },
    providerSigned: { signed: isSigned, name: null, date: null },
    apprenticeSigned: { signed: hasApprenticeSigned, name: null, date: null },
    documentUrl: cs.finalSignedPdfKey ?? null,
    publishedAt: cs.publishedAt,
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function CommitmentsDashboard() {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // { type: 'sign', statement } | null
  const [drawer, setDrawer] = useState(false);
  const [panel, setPanel] = useState(null);

  const { data: rawStatements = [], isLoading } = useCommitmentStatements();
  const { roster } = useApprenticeRoster();

  const rosterById = useMemo(() => {
    const map = {};
    for (const a of roster) map[a.id] = a;
    return map;
  }, [roster]);

  const statements = useMemo(
    () => rawStatements.map((cs) => normalizeStatement(cs, rosterById)),
    [rawStatements, rosterById],
  );

  // First statement awaiting employer signature
  const pendingSignature = statements.find(
    (s) => s.status === "pending_employer",
  );

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        style={{ color: T.muted }}
      >
        <p className="text-sm">Loading commitments…</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Commitments
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Commitment statements
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Download all
          </button>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            <Plus className="h-3.5 w-3.5" /> New statement
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ComplianceBanner
        statements={statements}
        onSignNow={(s) => setModal({ type: "sign", statement: s })}
      />
      <CommitmentStatCards statements={statements} />

      {pendingSignature && (
        <SigningAlert
          statement={pendingSignature}
          onSignNow={() =>
            setModal({ type: "sign", statement: pendingSignature })
          }
          onViewDoc={() => setPanel(pendingSignature)}
        />
      )}

      <div className="space-y-3">
        <CommitmentToolbar filter={filter} onFilter={setFilter} />
        <CommitmentList
          statements={statements}
          filter={filter}
          onSign={(s) => setModal({ type: "sign", statement: s })}
          onView={setPanel}
        />
      </div>

      <SignNowModal
        open={modal?.type === "sign"}
        statement={modal?.statement ?? null}
        onClose={() => setModal(null)}
      />
      {drawer && <DraftDrawer onClose={() => setDrawer(false)} />}
      {panel && (
        <DocumentPanel statement={panel} onClose={() => setPanel(null)} />
      )}
    </div>
  );
}
