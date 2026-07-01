"use client";

import { BookOpen } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";

import { useAiProgrammeCatalogue } from "../queries/ai-programmes.query";

const COLUMNS = [
  {
    key: "title",
    header: "Programme",
    primary: true,
    sortable: true,
    cell: (row) => (
      <div>
        <p className="font-medium text-neutral-900">{row.title}</p>
        <p className="text-xs text-neutral-500">{row.code}</p>
      </div>
    ),
  },
  {
    key: "deliveryType",
    header: "Delivery",
    cell: (row) => (
      <TextBadge variant="light" color="purple" size="xs">
        {row.deliveryType?.replace(/_/g, " ") ?? "—"}
      </TextBadge>
    ),
  },
  {
    key: "moduleCount",
    header: "Modules",
    align: "right",
    sortable: true,
    cell: (row) => row.moduleCount ?? 0,
  },
];

export function AiProgrammeCatalogueTable() {
  const { data: programmes = [], isLoading } = useAiProgrammeCatalogue();

  return (
    <DataTable
      columns={COLUMNS}
      data={programmes}
      isLoading={isLoading}
      rowKey={(row) => row.id}
      empty={{
        icon: BookOpen,
        title: "No AI programmes available",
        description:
          "The FlowPortal AI catalogue is empty for your organisation.",
      }}
    />
  );
}
