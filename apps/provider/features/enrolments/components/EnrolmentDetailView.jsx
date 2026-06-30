"use client";

import {
  Building2,
  CalendarClock,
  ClipboardList,
  Pencil,
  Users2,
} from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useApprentice } from "@/features/apprentices/queries/apprentices.query";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { CommitmentStatementPanel } from "@/features/commitment-statements/components/CommitmentStatementPanel";
import { EnrolmentPortfolioPanel } from "@/features/portfolio/components/EnrolmentPortfolioPanel";
import { EnrolmentReviewsPanel } from "@/features/reviews/components/EnrolmentReviewsPanel";
import { useStandard } from "@/features/standards/queries/standards.query";
import { cn, formatDate, getFullName } from "@/utils/helper";

import { EnrolmentActionsMenu } from "./EnrolmentActionsMenu";
import { EnrolmentStatusBadge, PipelineStateBadge } from "./EnrolmentBadges";
import { EnrolmentJourney } from "./EnrolmentJourney";
import { OrganisationLinksModal } from "./OrganisationLinksModal";
import { ParticipantsModal } from "./ParticipantsModal";
import { SetEpaDateModal } from "./SetEpaDateModal";
import { useEnrolment, useEnrolmentJourney } from "../queries/enrolments.query";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

function money(value) {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  return Number.isNaN(n) ? "—" : GBP.format(n);
}

// Monospace ID row used in the Connections card. Shows "Not set" when empty.
function IdRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-neutral-500">{label}</span>
      <span
        className={cn(
          "truncate text-xs",
          value ? "font-mono text-neutral-700" : "text-neutral-400",
        )}
      >
        {value || "Not set"}
      </span>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800">{value}</p>
    </div>
  );
}

export function EnrolmentDetailView({ enrolmentId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const { data: enrolment, isLoading, isError } = useEnrolment(enrolmentId);
  const {
    data: journey,
    isLoading: journeyLoading,
    isError: journeyError,
  } = useEnrolmentJourney(enrolmentId);

  // Resolve apprentice + standard for the header. Cheap single-record fetches,
  // cached and shared with the list's option lookups.
  const { data: apprentice } = useApprentice(enrolment?.apprenticeId, {
    enabled: !!enrolment?.apprenticeId,
  });
  const { data: standard } = useStandard(enrolment?.standardId, {
    enabled: !!enrolment?.standardId,
  });

  const [epaOpen, setEpaOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [orgLinksOpen, setOrgLinksOpen] = useState(false);

  const headerTitle = useMemo(
    () => (apprentice ? getFullName(apprentice) : "Enrolment"),
    [apprentice],
  );

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-8 text-center text-sm text-neutral-500">
            This enrolment could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800" />

      <PageSubheader
        icon={ClipboardList}
        eyebrow="Enrolment"
        title={headerTitle}
        description={
          standard
            ? `${standard.title} (${standard.code})`
            : "Apprenticeship enrolment"
        }
        actions={
          enrolment && canManage ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="green"
                variant="neutral"
                startIcon={<CalendarClock className="size-4" />}
                onClick={() => setEpaOpen(true)}
              >
                Set EPA date
              </Button>
              <EnrolmentActionsMenu enrolment={enrolment} />
            </div>
          ) : null
        }
      />

      {/* Summary */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-neutral-900">Summary</h2>
          <div className="flex items-center gap-2">
            {enrolment ? (
              <EnrolmentStatusBadge status={enrolment.status} />
            ) : null}
            {enrolment ? (
              <PipelineStateBadge state={enrolment.pipelineState} />
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || !enrolment ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-md bg-neutral-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
              <SummaryItem
                label="Apprentice"
                value={apprentice ? getFullName(apprentice) : "—"}
              />
              <SummaryItem
                label="Standard"
                value={standard ? standard.title : "—"}
              />
              <SummaryItem
                label="Agreed price"
                value={money(enrolment.agreedPrice)}
              />
              <SummaryItem
                label="Completion payment"
                value={
                  enrolment.completionPaymentPercent === null ||
                  enrolment.completionPaymentPercent === undefined
                    ? "—"
                    : `${enrolment.completionPaymentPercent}%`
                }
              />
              <SummaryItem
                label="Planned start"
                value={
                  enrolment.plannedStartDate
                    ? formatDate(enrolment.plannedStartDate)
                    : "—"
                }
              />
              <SummaryItem
                label="Planned end"
                value={
                  enrolment.plannedEndDate
                    ? formatDate(enrolment.plannedEndDate)
                    : "—"
                }
              />
              <SummaryItem
                label="Duration"
                value={
                  enrolment.plannedDurationMonths
                    ? `${enrolment.plannedDurationMonths} months`
                    : "—"
                }
              />
              <SummaryItem
                label="EPA date"
                value={
                  enrolment.epaDate ? formatDate(enrolment.epaDate) : "Not set"
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connections: participants + organisation links */}
      {enrolment ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="size-4 text-neutral-400" aria-hidden />
                <h2 className="text-base font-semibold text-neutral-900">
                  Participants
                </h2>
              </div>
              {canManage ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<Pencil className="size-3.5" />}
                  onClick={() => setParticipantsOpen(true)}
                >
                  Edit
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="divide-y divide-neutral-100 py-2">
              <IdRow
                label="Apprentice user"
                value={enrolment.apprenticeUserId}
              />
              <IdRow label="Tutor user" value={enrolment.tutorUserId} />
              <IdRow
                label="Employer manager"
                value={enrolment.employerManagerUserId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-neutral-400" aria-hidden />
                <h2 className="text-base font-semibold text-neutral-900">
                  Organisation links
                </h2>
              </div>
              {canManage ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<Pencil className="size-3.5" />}
                  onClick={() => setOrgLinksOpen(true)}
                >
                  Edit
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="divide-y divide-neutral-100 py-2">
              <IdRow
                label="Employer organisation"
                value={enrolment.employerOrganisationId}
              />
              <IdRow
                label="Provider organisation"
                value={enrolment.providerOrganisationId}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Commitment statement (1:1 with the enrolment) */}
      {enrolment ? (
        <CommitmentStatementPanel enrolment={enrolment} canManage={canManage} />
      ) : null}

      {/* Progress reviews for this enrolment */}
      {enrolment ? (
        <EnrolmentReviewsPanel enrolment={enrolment} canManage={canManage} />
      ) : null}

      {/* Portfolio: KSB coverage, evidence review, EPA pack */}
      {enrolment ? (
        <EnrolmentPortfolioPanel enrolment={enrolment} canManage={canManage} />
      ) : null}

      {/* Journey */}
      <EnrolmentJourney
        journey={journey}
        isLoading={journeyLoading}
        isError={journeyError}
      />

      {enrolment ? (
        <>
          <SetEpaDateModal
            enrolmentId={enrolment.id}
            currentEpaDate={enrolment.epaDate}
            open={epaOpen}
            onClose={() => setEpaOpen(false)}
          />
          <ParticipantsModal
            enrolment={enrolment}
            open={participantsOpen}
            onClose={() => setParticipantsOpen(false)}
          />
          <OrganisationLinksModal
            enrolment={enrolment}
            open={orgLinksOpen}
            onClose={() => setOrgLinksOpen(false)}
          />
        </>
      ) : null}
    </div>
  );
}
