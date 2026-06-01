"use client";
import { Bell, Download, Plus } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { CommitmentList } from "./CommitmentList";
import { CommitmentStatCards } from "./CommitmentStatCards";
import { CommitmentToolbar } from "./CommitmentToolbar";
import { ComplianceBanner } from "./ComplianceBanner";
import { STATEMENTS } from "./data";
import { DocumentPanel } from "./DocumentPanel";
import { DraftDrawer } from "./DraftDrawer";
import { SigningAlert } from "./SigningAlert";
import { SignNowModal } from "./SignNowModal";

const CS003 = STATEMENTS.find((s) => s.id === "CS-003");

export function CommitmentsDashboard() {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // 'sign' | null
  const [drawer, setDrawer] = useState(false);
  const [panel, setPanel] = useState(null); // statement | null
  const [alertOn, setAlertOn] = useState(true);

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Midlands Engineering → Commitments
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Commitments
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Download className="h-3.5 w-3.5" /> Download all
          </button>
          <button
            type="button"
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

      <ComplianceBanner />
      <CommitmentStatCards />

      {alertOn && (
        <SigningAlert
          onSignNow={() => setModal("sign")}
          onViewDoc={() => setPanel(CS003)}
          onDismiss={() => setAlertOn(false)}
        />
      )}

      <div className="space-y-3">
        <CommitmentToolbar filter={filter} onFilter={setFilter} />
        <CommitmentList filter={filter} />
      </div>

      <SignNowModal open={modal === "sign"} onClose={() => setModal(null)} />
      {drawer && <DraftDrawer onClose={() => setDrawer(false)} />}
      {panel && (
        <DocumentPanel statement={panel} onClose={() => setPanel(null)} />
      )}
    </div>
  );
}
