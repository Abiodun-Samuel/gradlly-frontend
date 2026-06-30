"use client";

import { Check, FileText, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useProgrammes } from "@/features/programmes/queries/programmes.query";
import { STORAGE_CATEGORY } from "@/features/storage/services/storage.service";
import { cn } from "@/utils/helper";

import { FileUploadButton } from "./FileUploadButton";
import { PROGRAMME_DOC_TYPE_LABELS, PROGRAMME_DOC_TYPES } from "../constants";
import {
  useCreateProgrammeDocument,
  useProgrammeDocuments,
} from "../queries/ofsted.query";

function DocTypeRow({ programmeId, documentType, present, canManage }) {
  const { mutate, isPending } = useCreateProgrammeDocument();

  const attach = (storageKey) =>
    mutate({ programmeId, payload: { documentType, storageKey } });

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-md border",
            present
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-neutral-300 bg-white",
          )}
          aria-hidden
        >
          {present ? <Check className="size-3.5" /> : null}
        </span>
        <span
          className={cn(
            "text-sm",
            present ? "text-neutral-500" : "text-neutral-800",
          )}
        >
          {PROGRAMME_DOC_TYPE_LABELS[documentType] ?? documentType}
        </span>
      </div>

      {!present && canManage ? (
        isPending ? (
          <Loader2
            className="size-4 animate-spin text-neutral-400"
            aria-hidden
          />
        ) : (
          // One document per type — uploading immediately registers it.
          <FileUploadButton
            category={STORAGE_CATEGORY.ATTACHMENT}
            label="Upload"
            onUploaded={attach}
          />
        )
      ) : null}
    </div>
  );
}

function ProgrammeDocsCard({ programme, canManage }) {
  const { data: docs = [], isLoading } = useProgrammeDocuments(programme.id);
  const presentTypes = useMemo(
    () => new Set(docs.map((d) => d.documentType)),
    [docs],
  );

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-neutral-900">
          {programme.title}
        </p>
        <span className="shrink-0 text-xs text-neutral-400">
          {presentTypes.size}/{PROGRAMME_DOC_TYPES.length}
        </span>
      </div>
      {isLoading ? (
        <p className="mt-2 text-xs text-neutral-400">Loading documents…</p>
      ) : (
        <div className="mt-2 divide-y divide-neutral-100">
          {PROGRAMME_DOC_TYPES.map((type) => (
            <DocTypeRow
              key={type}
              programmeId={programme.id}
              documentType={type}
              present={presentTypes.has(type)}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgrammeDocumentsPanel({ canManage = true }) {
  const { data, isLoading } = useProgrammes({ perPage: 100 });
  const programmes = data?.programmes ?? [];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <FileText className="size-4 text-neutral-400" aria-hidden />
        <h2 className="text-base font-semibold text-neutral-900">
          Programme documents
        </h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading programmes…
          </p>
        ) : programmes.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No programmes yet. Create programmes to attach EIF curriculum
            documents.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {programmes.map((p) => (
              <ProgrammeDocsCard
                key={p.id}
                programme={p}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
