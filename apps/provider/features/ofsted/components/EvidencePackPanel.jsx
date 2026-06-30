"use client";

import { Download, Loader2, Package, PackageCheck } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDownloadObject } from "@/features/storage/queries/storage.query";

import { EVIDENCE_PACK_STATUS } from "../constants";
import {
  useCreateEvidencePackJob,
  useEvidencePackJob,
} from "../queries/ofsted.query";

/**
 * Org-wide Ofsted inspector evidence pack (distinct from the per-enrolment EPA
 * pack). Owner/admin only — the parent gates rendering.
 */
export function EvidencePackPanel() {
  const create = useCreateEvidencePackJob();
  const { download, isDownloading } = useDownloadObject();
  const [jobId, setJobId] = useState(null);

  const { data: job } = useEvidencePackJob(jobId, { enabled: !!jobId });
  const status = job?.status;
  const inFlight =
    status === EVIDENCE_PACK_STATUS.QUEUED ||
    status === EVIDENCE_PACK_STATUS.PROCESSING;
  const completed = status === EVIDENCE_PACK_STATUS.COMPLETED;
  const failed = status === EVIDENCE_PACK_STATUS.FAILED;

  const handleBuild = async () => {
    try {
      // No additionalStorageKeys for the standard build.
      const result = await create.mutateAsync(undefined);
      if (result?.jobId) setJobId(result.jobId);
    } catch {
      // surfaced via mutation onError toast
    }
  };

  const handleDownload = () => {
    if (job?.downloadUrl) {
      window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
    } else if (job?.outputKey) {
      download(job.outputKey);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Inspector evidence pack
          </h2>
        </div>
        {!inFlight ? (
          <Button
            size="sm"
            color="green"
            loading={create.isPending}
            disabled={create.isPending}
            startIcon={<Package className="size-4" />}
            onClick={handleBuild}
          >
            {job ? "Rebuild pack" : "Build pack"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-500">
          Compiles all org-wide quality artefacts (OTJ, reviews, commitments,
          ILR, portfolio, QIP) into a ZIP organised by EIF theme for inspectors.
        </p>

        {inFlight ? (
          <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
            Building the inspector pack…
          </div>
        ) : null}

        {failed ? (
          <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
            Pack build failed{job?.errorMessage ? `: ${job.errorMessage}` : "."}
          </div>
        ) : null}

        {completed ? (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <PackageCheck className="size-4" aria-hidden />
              Pack ready
            </div>

            {job?.manifest ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                {Object.entries(job.manifest).map(([theme, count]) => (
                  <div
                    key={theme}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="capitalize text-neutral-500">
                      {theme.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold tabular-nums text-neutral-800">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <Button
              size="sm"
              color="black"
              variant="neutral"
              loading={isDownloading}
              startIcon={<Download className="size-4" />}
              onClick={handleDownload}
            >
              Download ZIP
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
