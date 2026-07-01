"use client";

import { Link2 } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { formatDateTime } from "@/utils/helper";

import { useDonorLinks } from "../queries/levy-exchange.query";

const STATUS_COLORS = {
  pending_consent: "yellow",
  active: "green",
  sync_failed: "red",
  revoked: "gray",
};

const COLUMNS = [
  {
    key: "label",
    header: "Link",
    primary: true,
    cell: (row) => row.label ?? row.dasAccountId ?? row.id.slice(0, 8),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <TextBadge
        variant="light"
        color={STATUS_COLORS[row.status] ?? "gray"}
        size="xs"
      >
        {row.status?.replace(/_/g, " ")}
      </TextBadge>
    ),
  },
  {
    key: "lastBalance",
    header: "Balance",
    align: "right",
    cell: (row) => (row.lastBalance ? `£${row.lastBalance}` : "—"),
  },
  {
    key: "lastSyncedAt",
    header: "Last synced",
    cell: (row) => (row.lastSyncedAt ? formatDateTime(row.lastSyncedAt) : "—"),
  },
];

export function DonorLinksTable() {
  const { data: links = [], isLoading } = useDonorLinks();

  return (
    <DataTable
      columns={COLUMNS}
      data={links}
      isLoading={isLoading}
      rowKey={(row) => row.id}
      empty={{
        icon: Link2,
        title: "No donor links",
        description: "Connect a DAS donor account to start levy exchange.",
      }}
    />
  );
}
