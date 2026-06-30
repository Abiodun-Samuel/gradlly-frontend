"use client";

import { AlertTriangle, Download, ExternalLink, FileText } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { useDownloadObject } from "@/features/storage/queries/storage.query";

import { EvidenceActions } from "./EvidenceActions";
import { EvidenceStatusBadge, KsbKindBadge } from "./PortfolioBadges";
import { EVIDENCE_TYPE } from "../constants";
import { useEvidenceItem } from "../queries/portfolio.query";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-neutral-700">{value ?? "—"}</p>
    </div>
  );
}

export function EvidenceDetailView({ evidenceId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const { data: item, isError } = useEvidenceItem(evidenceId);
  const { download, isDownloading } = useDownloadObject();

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            This evidence item could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const ksbs = item?.ksbDefinitions ?? [];

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />

      <PageSubheader
        icon={FileText}
        eyebrow="KSB evidence"
        title={item?.title ?? "Evidence"}
        description={item ? `${item.type} evidence` : undefined}
        actions={canManage && item ? <EvidenceActions item={item} /> : null}
      />

      {item ? (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Details
            </h2>
            <EvidenceStatusBadge status={item.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            {item.returnReason ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-amber-600"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Returned to apprentice
                  </p>
                  <p className="mt-0.5 text-sm text-amber-700">
                    {item.returnReason}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Type" value={item.type} />
              <Field label="Apprentice" value={item.apprenticeId} />
              <Field label="Enrolment" value={item.enrolmentId} />
            </div>

            {/* Type-specific payload */}
            {item.type === EVIDENCE_TYPE.TEXT && item.body ? (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Evidence
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-700">
                  {item.body}
                </p>
              </div>
            ) : null}

            {item.type === EVIDENCE_TYPE.LINK && item.externalUrl ? (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-primary-700 transition-colors hover:bg-neutral-50"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{item.externalUrl}</span>
              </a>
            ) : null}

            {item.type === EVIDENCE_TYPE.FILE && item.storageKey ? (
              <Button
                size="sm"
                color="black"
                variant="neutral"
                loading={isDownloading}
                startIcon={<Download className="size-4" />}
                onClick={() => download(item.storageKey)}
              >
                Download file
              </Button>
            ) : null}

            {item.body && item.type !== EVIDENCE_TYPE.TEXT ? (
              <Field label="Commentary" value={item.body} />
            ) : null}

            {/* Mapped KSBs */}
            {ksbs.length ? (
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Mapped KSBs
                </p>
                <div className="flex flex-wrap gap-2">
                  {ksbs.map((k) => (
                    <span
                      key={k.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs"
                    >
                      <span className="font-mono font-semibold text-neutral-700">
                        {k.code}
                      </span>
                      <KsbKindBadge kind={k.kind} />
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
