"use client";

import { Handshake } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";

import { useLevyMatches } from "../queries/levy-exchange.query";

const COLUMNS = [
  {
    key: "donorDisplayName",
    header: "Donor",
    primary: true,
    sortable: true,
    cell: (row) => row.donorDisplayName,
  },
  {
    key: "matchScore",
    header: "Match score",
    align: "right",
    sortable: true,
    cell: (row) => row.matchScore,
  },
  {
    key: "transferableAmount",
    header: "Transferable",
    align: "right",
    cell: (row) => `£${row.transferableAmount}`,
  },
  {
    key: "programmeEligible",
    header: "Programme",
    cell: (row) => (
      <TextBadge
        variant="light"
        color={row.programmeEligible ? "green" : "gray"}
        size="xs"
      >
        {row.programmeEligible ? "Eligible" : "Not eligible"}
      </TextBadge>
    ),
  },
];

export function MatchResultsTable() {
  const { data, isLoading, isError, error } = useLevyMatches();
  const matches = data?.matches ?? [];

  if (isError) {
    return (
      <p className="text-sm text-danger-600">
        {error?.message ?? "Unable to search for matches."}
      </p>
    );
  }

  if (data?.addedToWaitingPool && matches.length === 0) {
    return (
      <p className="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
        No donors matched your profile. You have been added to the waiting pool.
      </p>
    );
  }

  return (
    <DataTable
      columns={COLUMNS}
      data={matches}
      isLoading={isLoading}
      rowKey={(row) => row.donorOrganisationId}
      empty={{
        icon: Handshake,
        title: "No matches found",
        description: "Complete your recipient profile to search for donors.",
      }}
    />
  );
}
