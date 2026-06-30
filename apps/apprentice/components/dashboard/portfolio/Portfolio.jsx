"use client";

import { useState } from "react";

import { KSB_DATA } from "@/data/portfolio.data";
import { useLearnerDocument } from "@/features/portfolio/queries/portfolio.query";

import { AddEvidenceModal } from "./add/AddEvidenceModal";
import { PortfolioEvidenceList } from "./PortfolioEvidenceList";
import { PortfolioGatewayPanel } from "./PortfolioGatewayPanel";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioKSBGrid } from "./PortfolioKSBGrid";
import { PortfolioStatCards } from "./PortfolioStatCards";

export function Portfolio() {
  const [activeKSB, setActiveKSB] = useState(null);
  const {
    data: learnerDoc,
    isLoading: docLoading,
    error: docError,
  } = useLearnerDocument();
  const [addOpen, setAddOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState([]);
  const [ksbUpdates, setKsbUpdates] = useState({});

  function handleEvidenceAdded(data) {
    setNewEvidence((prev) => [{ ...data, id: Date.now() }, ...prev]);

    if (data.status === "draft") return;

    const updates = {};
    (data.ksbDefinitionIds ?? []).forEach((code) => {
      const base = KSB_DATA.find((k) => k.code === code);
      if (base?.state === "not_started" && !ksbUpdates[code]) {
        updates[code] = "in_progress";
      }
    });
    if (Object.keys(updates).length) {
      setKsbUpdates((prev) => ({ ...prev, ...updates }));
    }
  }

  return (
    <>
      <div className="space-y-6 pb-10">
        <PortfolioHeader onAddEvidence={() => setAddOpen(true)} />
        <PortfolioStatCards />
        <PortfolioKSBGrid
          activeKSB={activeKSB}
          onSelect={setActiveKSB}
          ksbUpdates={ksbUpdates}
        />
        <PortfolioEvidenceList
          activeKSB={activeKSB}
          newEvidence={newEvidence}
          onAddEvidence={() => setAddOpen(true)}
        />
        <PortfolioGatewayPanel />

        {/* Learner document debug — /api/v1/leaners/me/document */}
        <div className="surface-card p-4 space-y-2">
          <p className="text-xs font-semibold text-neutral-500">
            GET /api/v1/leaners/me/document
          </p>
          {docLoading && <p className="text-xs text-neutral-400">Loading…</p>}
          {docError && (
            <p className="text-xs text-danger-600">{docError.message}</p>
          )}
          {learnerDoc && (
            <pre className="text-xs text-neutral-700 bg-neutral-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {JSON.stringify(learnerDoc, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <AddEvidenceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onEvidenceAdded={handleEvidenceAdded}
      />
    </>
  );
}
