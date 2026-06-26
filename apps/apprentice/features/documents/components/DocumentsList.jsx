"use client";

import { Download, FileText } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { cn, formatDateTime } from "@/utils/helper";

import { DOCUMENT_TYPE_LABELS } from "../constants";
import { useMyDocuments } from "../queries/documents.query";

const TYPE_COLORS = {
  commitment: "purple",
  review: "blue",
  evidence: "green",
};

export function DocumentsList({ types } = {}) {
  const { data: groups = [], isLoading } = useMyDocuments();

  const flatItems = useMemo(() => {
    const items = [];
    for (const group of groups) {
      for (const item of group.items ?? []) {
        items.push({ ...item, enrolmentId: group.enrolmentId });
      }
    }
    if (!types?.length) return items;
    return items.filter((item) => types.includes(item.type));
  }, [groups, types]);

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading documents…</p>;
  }

  if (flatItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <FileText className="size-10 text-neutral-300" aria-hidden />
        <h3 className="mt-4 text-base font-semibold text-neutral-800">
          No documents yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">
          Signed commitments, completed reviews, and accepted evidence will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flatItems.map((doc) => (
        <Card key={doc.id} className="transition-shadow hover:shadow-sm">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium text-neutral-900">
                  {doc.title}
                </p>
                <TextBadge
                  variant="light"
                  color={TYPE_COLORS[doc.type] ?? "gray"}
                  size="xs"
                >
                  {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                </TextBadge>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                {doc.documentAt ? formatDateTime(doc.documentAt) : "—"}
              </p>
            </div>
            {doc.downloadUrl ? (
              <a
                href={doc.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5",
                  "text-xs font-medium text-primary-700 ring-1 ring-primary-200",
                  "transition-colors hover:bg-primary-50",
                )}
              >
                <Download className="size-3.5" aria-hidden />
                Download
              </a>
            ) : doc.externalUrl ? (
              <a
                href={doc.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-primary-700 hover:underline"
              >
                Open link
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
