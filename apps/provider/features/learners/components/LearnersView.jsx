"use client";

import { ShieldAlert, Users } from "lucide-react";
import { useState } from "react";

import { TabNav } from "@/components/ui/TabNav";

import { CohortTable } from "./CohortTable";
import { InterventionQueue } from "./InterventionQueue";
import { useInterventionQueue } from "../queries/learners.query";

const TABS = {
  COHORT: "cohort",
  QUEUE: "queue",
};

export function LearnersView() {
  const [tab, setTab] = useState(TABS.COHORT);

  // Surface the at-risk count as a tab badge (cheap; cached query).
  const { data: queue } = useInterventionQueue();
  const atRiskCount = queue?.atRiskCount ?? 0;

  const tabs = [
    { value: TABS.COHORT, label: "Cohort", icon: Users },
    {
      value: TABS.QUEUE,
      label: "At-risk queue",
      icon: ShieldAlert,
      badge: atRiskCount || undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
      <TabNav
        tabs={tabs}
        value={tab}
        onChange={setTab}
        ariaLabel="Learner views"
      />
      <div className="min-w-0">
        {tab === TABS.COHORT ? <CohortTable /> : <InterventionQueue />}
      </div>
    </div>
  );
}
