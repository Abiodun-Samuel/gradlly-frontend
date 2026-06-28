"use client";

import { useState } from "react";

import {
  useLevyExpiryCalendar,
  useLevyMatchApplications,
  useLevySurplus,
} from "@/features/levy/queries/levy.query";

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
  const { data: levy } = useLevySurplus();
  const { data: expiryCalendar = [] } = useLevyExpiryCalendar();
  const { data: matchApplications = [] } = useLevyMatchApplications();

  const [expiryModal, setExpiryModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const openExpiry = () => setExpiryModal(true);
  const openExport = () => setExportModal(true);

  return (
    <div
      className="space-y-8"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="space-y-3">
        <ExpiryAlert levy={levy} />
        <DasSyncBanner
          levy={levy}
          isDegraded={das.isDegraded}
          fmtLastSynced={das.fmtLastSynced}
          onSync={das.sync}
        />
      </div>

      <section>
        <OverviewPanel
          das={das}
          levy={levy}
          onExpiryModal={openExpiry}
          onExport={openExport}
        />
      </section>

      <section className="space-y-4">
        <SectionLabel>Analysis</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LevyUtilisation levy={levy} onExpiryModal={openExpiry} />
          <YearEndForecast levy={levy} onExport={openExport} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
          <MonthlyChart levy={levy} />
          <ApprenticeTable />
        </div>
      </section>

      <section className="space-y-4">
        <SectionLabel>Planning & Transfers</SectionLabel>
        <TransferHub levy={levy} transfers={matchApplications} />
        <ExpiryTimeline
          expiryCalendar={expiryCalendar}
          onExpiryModal={openExpiry}
        />
      </section>

      <ActionCentre levy={levy} onSync={das.sync} />

      <ExpiryModal
        open={expiryModal}
        onClose={() => setExpiryModal(false)}
        levy={levy}
      />
      <ExportModal open={exportModal} onClose={() => setExportModal(false)} />
    </div>
  );
}

export default Dashboard;
