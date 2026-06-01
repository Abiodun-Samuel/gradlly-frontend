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
import { ROICards } from "./ROICards";
import { ScheduleForm } from "./ScheduleForm";

const FY_OPTIONS = [
  "FY 2024/25",
  "FY 2023/24",
  "Last 12 months",
  "Custom range",
];

const DELTAS = {
  "FY 2024/25": ["▲ +4%", "▲ +2%", "▲ +8%", "▼ -3%"],
  "FY 2023/24": ["▼ -4%", "▼ -2%", "▼ -8%", "▲ +3%"],
};

export function ReportsDashboard() {
  const [preview, setPreview] = useState(null);
  const [escalate, setEscalate] = useState(null);
  const [history, setHistory] = useState(false);
  const [fy, setFy] = useState("FY 2024/25");

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Midlands Engineering → Reports
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            Reports
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={fy}
            onChange={(e) => setFy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none"
            style={{
              borderColor: T.border,
              color: T.ink,
              backgroundColor: T.surface,
            }}
          >
            {FY_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
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

      <ReportStatCards fy={fy} deltas={DELTAS[fy]} />
      <ROICards />

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
