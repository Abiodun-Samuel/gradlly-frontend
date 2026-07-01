"use client";

import { FileCog, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

import { TabNav } from "@/components/ui/TabNav";

import { IlrRecordsTable } from "./IlrRecordsTable";
import { MappingConfigsPanel } from "./MappingConfigsPanel";

const TABS = {
  RECORDS: "records",
  CONFIGS: "configs",
};

export function IlrView() {
  const [tab, setTab] = useState(TABS.RECORDS);

  const tabs = [
    { value: TABS.RECORDS, label: "Learner records", icon: FileSpreadsheet },
    { value: TABS.CONFIGS, label: "Mapping configs", icon: FileCog },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr]">
      <TabNav tabs={tabs} value={tab} onChange={setTab} ariaLabel="ILR views" />
      <div className="min-w-0">
        {tab === TABS.RECORDS ? <IlrRecordsTable /> : <MappingConfigsPanel />}
      </div>
    </div>
  );
}
