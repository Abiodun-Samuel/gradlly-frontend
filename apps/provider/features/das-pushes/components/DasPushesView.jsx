"use client";

import { CheckCircle2, LogOut, Send } from "lucide-react";
import { useState } from "react";

import { TabNav } from "@/components/ui/TabNav";

import { FailedPushesTable } from "./FailedPushesTable";
import { PUSH_PIPELINE } from "../constants";

const TAB_ICONS = {
  [PUSH_PIPELINE.ENROLMENT]: Send,
  [PUSH_PIPELINE.COMPLETION]: CheckCircle2,
  [PUSH_PIPELINE.WITHDRAWAL]: LogOut,
};

export function DasPushesView() {
  const [pipeline, setPipeline] = useState(PUSH_PIPELINE.ENROLMENT);

  const tabs = [
    {
      value: PUSH_PIPELINE.ENROLMENT,
      label: "Enrolment",
      icon: TAB_ICONS[PUSH_PIPELINE.ENROLMENT],
    },
    {
      value: PUSH_PIPELINE.COMPLETION,
      label: "Completion",
      icon: TAB_ICONS[PUSH_PIPELINE.COMPLETION],
    },
    {
      value: PUSH_PIPELINE.WITHDRAWAL,
      label: "Withdrawal",
      icon: TAB_ICONS[PUSH_PIPELINE.WITHDRAWAL],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
      <TabNav
        tabs={tabs}
        value={pipeline}
        onChange={setPipeline}
        ariaLabel="Push pipelines"
      />
      <div className="min-w-0">
        {/* key remounts the table per pipeline so paging/selection reset */}
        <FailedPushesTable key={pipeline} pipeline={pipeline} />
      </div>
    </div>
  );
}
