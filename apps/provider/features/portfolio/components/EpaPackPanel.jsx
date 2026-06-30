"use client";

import { Download, Loader2, Package, PackageCheck } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDownloadObject } from "@/features/storage/queries/storage.query";

import { EPA_PACK_STATUS } from "../constants";
import { useCreateEpaPackJob, useEpaPackJob } from "../queries/portfolio.query";

function ManifestRow({ label, count }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold tabular-nums text-neutral-800">
        {count ?? 0}
      </span>
    </div>
  );
}

/**
 * Queue an EPA pack build for an enrolment, poll it, and download the ZIP.
 *
 * @param {string}  enrolmentId
 * @param {boolean} canManage
 */
export function EpaPackPanel({ enrolmentId, canManage = true }) {
  const create = useCreateEpaPackJob();
  const { download, isDownloading } = useDownloadObject();
  const [jobId, setJobId] = useState(null);

  const { data: job } = useEpaPackJob(jobId, { enabled: !!jobId });
  const status = job?.status;
  const inFlight =
    status === EPA_PACK_STATUS.QUEUED || status === EPA_PACK_STATUS.PROCESSING;
  const completed = status === EPA_PACK_STATUS.COMPLETED;
  const failed = status === EPA_PACK_STATUS.FAILED;

  // Start polling the freshly-created job (set state from the mutation result,
  // not an effect, to avoid cascading renders).
  const handleBuild = async () => {
    try {
      const job = await create.mutateAsync(enrolmentId);
      if (job?.jobId) setJobId(job.jobId);
    } catch {
      // surfaced via the mutation's onError toast
    }
  };

  const handleDownload = () => {
    const key = job?.outputKey;
    if (job?.downloadUrl) {
      window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
    } else if (key) {
      download(key);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">EPA pack</h2>
        </div>
        {canManage && !inFlight ? (
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
          Compiles all accepted evidence, the coverage summary, completed review
          PDFs, the OTJ summary, and the signed commitment into a ZIP for the
          EPAO.
        </p>

        {inFlight ? (
          <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
            Building the EPA pack… this can take a little while.
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
                <ManifestRow label="Knowledge" count={job.manifest.knowledge} />
                <ManifestRow label="Skill" count={job.manifest.skill} />
                <ManifestRow label="Behaviour" count={job.manifest.behaviour} />
                <ManifestRow label="Reviews" count={job.manifest.reviews} />
                <ManifestRow
                  label="Commitment"
                  count={job.manifest.commitment}
                />
                <ManifestRow label="Summaries" count={job.manifest.summaries} />
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
