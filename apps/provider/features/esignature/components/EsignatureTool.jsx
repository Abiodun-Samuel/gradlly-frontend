"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Download,
  FileSignature,
  PenTool,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import {
  STORAGE_CATEGORY,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { applyServerErrors, normalizeApiClientError } from "@/lib/errors";
import { cn } from "@/utils/helper";

import { SignatureStatusBadge } from "./SignatureStatusBadge";
import { PDF_SOURCE, SIGNATURE_STATUS } from "../constants";
import {
  useCreateSignatureRecord,
  useSignSignatureRecord,
} from "../queries/esignature.query";
import {
  signatureRecordDefaults,
  signatureRecordSchema,
  toSignatureRecordPayload,
} from "../schemas";

const ACCEPTED = "image/png";

function SourceTab({ active, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary-600 text-white"
          : "bg-white text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50",
      )}
    >
      {label}
    </button>
  );
}

export function EsignatureTool() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // The created record (pending → signed/failed) and the signed result.
  const [record, setRecord] = useState(null);
  const [signedResult, setSignedResult] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signatureRecordSchema),
    defaultValues: signatureRecordDefaults,
    mode: "onBlur",
  });

  const pdfSource = useWatch({ control, name: "pdfSource" });

  const create = useCreateSignatureRecord();
  const sign = useSignSignatureRecord();
  const { download, isDownloading } = useDownloadObject();

  const busy = isUploading || create.isPending;

  // ── Create the record (upload signature → create with one PDF source) ──
  const onCreate = async (values) => {
    setLocalError(null);
    if (!file) {
      setLocalError(
        normalizeApiClientError({
          message: "Upload a signature image (PNG) first.",
          status: 400,
        }),
      );
      return;
    }

    try {
      setIsUploading(true);
      const signatureImageKey = await uploadFileForKey({
        file,
        category: STORAGE_CATEGORY.SIGNATURE,
      });
      setIsUploading(false);

      const created = await create.mutateAsync(
        toSignatureRecordPayload(values, signatureImageKey),
      );
      setRecord(created);
    } catch (err) {
      setIsUploading(false);
      applyServerErrors(err, setError);
      setLocalError(normalizeApiClientError(err));
    }
  };

  const handleSign = async () => {
    try {
      const result = await sign.mutateAsync(record.id);
      setSignedResult(result);
      // Reflect the signed status locally without a refetch.
      setRecord((prev) =>
        prev
          ? {
              ...prev,
              status: SIGNATURE_STATUS.SIGNED,
              signedPdfKey: result?.signedPdfKey,
            }
          : prev,
      );
    } catch {
      // surfaced via mutation onError toast
    }
  };

  const handleDownload = () => {
    const url = signedResult?.downloadUrl || record?.downloadUrl;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (record?.signedPdfKey) {
      download(record.signedPdfKey);
    }
  };

  const startOver = () => {
    setRecord(null);
    setSignedResult(null);
    setFile(null);
    setLocalError(null);
    if (fileRef.current) fileRef.current.value = "";
    reset(signatureRecordDefaults);
  };

  // ── Result view (record created) ──
  if (record) {
    const isSigned = record.status === SIGNATURE_STATUS.SIGNED;
    const isFailed = record.status === SIGNATURE_STATUS.FAILED;

    return (
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              Signature record
            </h2>
          </div>
          <SignatureStatusBadge status={record.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-neutral-50 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
              Record ID
            </p>
            <p className="mt-0.5 break-all font-mono text-xs text-neutral-600">
              {record.id}
            </p>
          </div>

          {isFailed ? (
            <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              Signing failed for this record (terminal). Start over to create a
              new record.
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {!isSigned && !isFailed ? (
              <Button
                color="green"
                loading={sign.isPending}
                disabled={sign.isPending}
                startIcon={<PenTool className="size-4" />}
                onClick={handleSign}
              >
                Sign document
              </Button>
            ) : null}

            {isSigned ? (
              <Button
                color="black"
                variant="neutral"
                loading={isDownloading}
                startIcon={<Download className="size-4" />}
                onClick={handleDownload}
              >
                Download signed PDF
              </Button>
            ) : null}

            <Button
              color="black"
              variant="neutral"
              startIcon={<RotateCcw className="size-4" />}
              onClick={startOver}
            >
              Start over
            </Button>
          </div>

          {isSigned ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Document signed and stored.
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  // ── Create view ──
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-neutral-900">
          Sign a document
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Upload a signature image and choose the PDF to sign. For commitment
          statements and reviews, use their own signing flow instead.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onCreate)}
          noValidate
          className="space-y-5"
        >
          <ServerErrorAlert error={localError || create.error} />

          {/* Signature image */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">
              Signature image (PNG)
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UploadCloud className="size-6 text-neutral-400" aria-hidden />
              {file ? (
                <span className="text-sm font-medium text-neutral-700">
                  {file.name}
                </span>
              ) : (
                <>
                  <span className="text-sm font-medium text-neutral-700">
                    Click to choose a signature PNG
                  </span>
                  <span className="text-xs text-neutral-400">
                    PNG · up to 25 MB
                  </span>
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED}
              className="sr-only"
              onChange={(e) => {
                setLocalError(null);
                setFile(e.target.files?.[0] ?? null);
              }}
            />
          </div>

          {/* PDF source */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">PDF source</p>
            <div className="flex gap-2">
              <SourceTab
                active={pdfSource === PDF_SOURCE.KEY}
                label="Existing PDF key"
                disabled={busy}
                onClick={() => setValue("pdfSource", PDF_SOURCE.KEY)}
              />
              <SourceTab
                active={pdfSource === PDF_SOURCE.JOB}
                label="Completed PDF job"
                disabled={busy}
                onClick={() => setValue("pdfSource", PDF_SOURCE.JOB)}
              />
            </div>

            {pdfSource === PDF_SOURCE.KEY ? (
              <InputField
                name="sourcePdfKey"
                label="Source PDF storage key"
                placeholder="orgs/…/file.pdf"
                register={register}
                error={errors.sourcePdfKey?.message}
                disabled={busy}
              />
            ) : (
              <InputField
                name="pdfJobId"
                label="PDF job ID"
                placeholder="UUID of a completed PDF job"
                register={register}
                error={errors.pdfJobId?.message}
                disabled={busy}
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              color="green"
              loading={busy}
              disabled={busy || !file}
              startIcon={<FileSignature className="size-4" />}
            >
              {isUploading ? "Uploading…" : "Create record"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
