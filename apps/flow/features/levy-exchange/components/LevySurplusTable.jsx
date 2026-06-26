"use client";

import { Coins } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import { formatDateTime } from "@/utils/helper";

import { useLevySurplus } from "../queries/levy-exchange.query";

const COLUMNS = [
  {
    key: "donorLinkLabel",
    header: "Donor account",
    primary: true,
    cell: (row) => row.donorLinkLabel ?? row.donorLinkId?.slice(0, 8),
  },
  {
    key: "availableSurplus",
    header: "Available surplus",
    align: "right",
    sortable: true,
    cell: (row) => `£${row.availableSurplus}`,
  },
  {
    key: "maxTransferable",
    header: "Max transferable",
    align: "right",
    cell: (row) => `£${row.maxTransferable}`,
  },
  {
    key: "alreadyTransferred",
    header: "Transferred",
    align: "right",
    cell: (row) => `£${row.alreadyTransferred}`,
  },
  {
    key: "computedAt",
    header: "Computed",
    cell: (row) => (row.computedAt ? formatDateTime(row.computedAt) : "—"),
  },
];

export function LevySurplusTable() {
  const { data: entries = [], isLoading } = useLevySurplus();

  return (
    <DataTable
      columns={COLUMNS}
      data={entries}
      isLoading={isLoading}
      rowKey={(row) => row.donorLinkId}
      empty={{
        icon: Coins,
        title: "No surplus data",
        description:
          "Link a donor DAS account and sync to view levy surplus snapshots.",
      }}
    />
  );
}
