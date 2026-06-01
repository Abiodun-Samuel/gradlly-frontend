"use client";

import { useState } from "react";

import { ActionCentre } from "./ActionCentre";
import { ApprenticeTable } from "./ApprenticeTable";
import { DasSyncBanner } from "./DasSyncBanner";
import { ExpiryAlert } from "./ExpiryAlert";
import { ExpiryModal } from "./ExpiryModal";
import { ExpiryTimeline } from "./ExpiryTimeline";
import { ExportModal } from "./ExportModal";
import { LevyUtilisation } from "./LevyUtilisation";
import { MonthlyChart } from "./MonthlyChart";
import { OverviewPanel } from "./OverviewPanel";
import { T } from "./tokens";
import { TransferHub } from "./TransferHub";
import { useDasSync } from "./useDasSync";
import { YearEndForecast } from "./YearEndForecast";

function SectionLabel({ children }) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-[0.1em]"
      style={{ color: T.muted }}
    >
      {children}
    </p>
  );
}

export function Dashboard() {
  const das = useDasSync();
  const [expiryModal, setExpiryModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const openExpiry = () => setExpiryModal(true);
  const openExport = () => setExportModal(true);

  return (
    <div
      className="space-y-8"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* ── Alerts (conditional, zero height when absent) ── */}
      <div className="space-y-3">
        <ExpiryAlert />
        <DasSyncBanner
          isDegraded={das.isDegraded}
          fmtLastSynced={das.fmtLastSynced}
          onSync={das.sync}
        />
      </div>

      {/* ── Overview ── */}
      <section>
        <OverviewPanel
          das={das}
          onExpiryModal={openExpiry}
          onExport={openExport}
        />
      </section>

      {/* ── Analysis ── */}
      <section className="space-y-4">
        <SectionLabel>Analysis</SectionLabel>

        {/* Row 1 — Levy position: current state vs projection (similar heights) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LevyUtilisation onExpiryModal={openExpiry} />
          <YearEndForecast onExport={openExport} />
        </div>

        {/* Row 2 — Activity detail: trend + per-apprentice breakdown */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          <MonthlyChart />
          <ApprenticeTable />
        </div>
      </section>

      {/* ── Planning ── */}
      <section className="space-y-4">
        <SectionLabel>Planning & Transfers</SectionLabel>
        <TransferHub />
        <ExpiryTimeline onExpiryModal={openExpiry} />
      </section>

      {/* ── Actions ── */}
      <ActionCentre onSync={das.sync} />

      {/* Modals */}
      <ExpiryModal open={expiryModal} onClose={() => setExpiryModal(false)} />
      <ExportModal open={exportModal} onClose={() => setExportModal(false)} />
    </div>
  );
}

export default Dashboard;
