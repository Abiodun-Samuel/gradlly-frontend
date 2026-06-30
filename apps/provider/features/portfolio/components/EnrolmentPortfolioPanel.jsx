"use client";

import { FolderOpen } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { EpaPackPanel } from "./EpaPackPanel";
import { EvidenceQueue } from "./EvidenceQueue";
import { KsbHeatmap } from "./KsbHeatmap";

/**
 * Portfolio section for the enrolment detail page: KSB coverage heatmap, the
 * enrolment's evidence review queue, and the EPA pack builder.
 *
 * @param {object}  enrolment
 * @param {boolean} canManage
 */
export function EnrolmentPortfolioPanel({ enrolment, canManage }) {
  const enrolmentId = enrolment?.id;
  if (!enrolmentId) return null;

  return (
    <div className="space-y-6">
      <KsbHeatmap enrolmentId={enrolmentId} canManage={canManage} />

      <Card>
        <CardHeader className="flex items-center gap-2">
          <FolderOpen className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">Evidence</h2>
        </CardHeader>
        <CardContent>
          <EvidenceQueue enrolmentId={enrolmentId} canManage={canManage} />
        </CardContent>
      </Card>

      <EpaPackPanel enrolmentId={enrolmentId} canManage={canManage} />

      <p className="text-center text-xs text-neutral-400">
        Looking for all evidence across enrolments?{" "}
        <Link
          href="/portfolio/evidence"
          className="font-medium text-primary-700 hover:underline"
        >
          Open the evidence review queue
        </Link>
        .
      </p>
    </div>
  );
}
