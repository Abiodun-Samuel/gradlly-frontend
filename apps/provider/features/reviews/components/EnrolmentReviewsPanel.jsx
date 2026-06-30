"use client";

import { CalendarPlus, ClipboardList, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDateTime } from "@/utils/helper";

import { ReviewDueChip, ReviewStatusBadge } from "./ReviewBadges";
import { ReviewScheduleModal } from "./ReviewScheduleModal";
import { useReviews } from "../queries/reviews.query";

/**
 * Lists a single enrolment's progress reviews with a schedule action. Mounted on
 * the enrolment detail page (reviews are scheduled in the enrolment context).
 *
 * @param {object}  enrolment
 * @param {boolean} canManage
 */
export function EnrolmentReviewsPanel({ enrolment, canManage }) {
  const enrolmentId = enrolment?.id;
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { data, isLoading } = useReviews(
    { enrolmentId, perPage: 100 },
    { enabled: !!enrolmentId },
  );
  const reviews = data?.reviews ?? [];

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              Progress reviews
            </h2>
          </div>
          {canManage ? (
            <Button
              size="xs"
              color="green"
              startIcon={<CalendarPlus className="size-3.5" />}
              onClick={() => setScheduleOpen(true)}
            >
              Schedule
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-neutral-400">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No reviews scheduled for this enrolment yet.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {r.title || "Progress review"}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {formatDateTime(r.scheduledAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ReviewDueChip review={r} />
                    <ReviewStatusBadge status={r.status} />
                    <Link
                      href={`/reviews/${r.id}`}
                      title="View review"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Eye className="size-3.5" aria-hidden />
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <ReviewScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        context={{
          enrolmentId,
          apprenticeId: enrolment?.apprenticeId,
        }}
      />
    </>
  );
}
