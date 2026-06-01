"use client";
import { Bell, Clock } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { EscalationModal } from "./EscalationModal";
import { ProviderPerformance } from "./ProviderPerformance";
import { ReportHistoryDrawer } from "./ReportHistoryDrawer";
import { ReportList } from "./ReportList";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { ReportStatCards } from "./ReportStatCards";
import { ScheduleForm } from "./ScheduleForm";

export function ReportsDashboard() {
  const [preview, setPreview] = useState(null);
  const [escalate, setEscalate] = useState(null);
  const [history, setHistory] = useState(false);

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Midlands Engineering → Reports
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Reports
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistory(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Clock className="h-3.5 w-3.5" /> Report history
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

      <ReportStatCards />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <ReportList onOpen={setPreview} />
        <div className="space-y-5">
          <ProviderPerformance onEscalate={setEscalate} />
          <ScheduleForm onViewSchedules={() => setHistory(true)} />
        </div>
      </div>

      <ReportPreviewModal
        open={!!preview}
        report={preview}
        onClose={() => setPreview(null)}
      />
      <EscalationModal
        open={!!escalate}
        provider={escalate}
        onClose={() => setEscalate(null)}
      />
      {history && <ReportHistoryDrawer onClose={() => setHistory(false)} />}
    </div>
  );
}
