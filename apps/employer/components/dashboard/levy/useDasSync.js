"use client";

import { useCallback } from "react";

import { DONOR_LINK_STATUSES } from "@/features/levy/constants";
import {
  useDonorLinks,
  useSyncDonorLink,
} from "@/features/levy/queries/levy.query";

import { fmtAgo } from "./helpers";

export function useDasSync() {
  const { data: donorLinks = [], isLoading } = useDonorLinks();
  const syncMutation = useSyncDonorLink();

  const activeLink =
    donorLinks.find((l) => l.status === DONOR_LINK_STATUSES.ACTIVE) ??
    donorLinks[0] ??
    null;

  const isDegraded =
    !isLoading &&
    donorLinks.length > 0 &&
    donorLinks.every((l) => l.status === DONOR_LINK_STATUSES.ERROR);

  const lastSynced = activeLink?.lastSyncedAt
    ? new Date(activeLink.lastSyncedAt)
    : null;

  const activeLinkId = activeLink?.id ?? null;

  const sync = useCallback(() => {
    if (!activeLinkId || syncMutation.isPending) return;
    syncMutation.mutate(activeLinkId);
  }, [activeLinkId, syncMutation]);

  return {
    syncState: syncMutation.isPending
      ? "syncing"
      : syncMutation.isSuccess
        ? "done"
        : syncMutation.isError
          ? "error"
          : "idle",
    isDegraded,
    sync,
    lastSynced,
    fmtLastSynced: () => fmtAgo(lastSynced),
    isLoading,
  };
}
