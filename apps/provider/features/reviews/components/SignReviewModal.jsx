"use client";

import { PenTool, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  STORAGE_CATEGORY,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { normalizeApiClientError } from "@/lib/errors";

import { PARTY_LABELS } from "../constants";
import { useSignReview } from "../queries/reviews.query";

const ACCEPTED = "image/png,image/jpeg,image/webp";

/**
 * Sign one tripartite review slot: upload the signature image (→ S3 key), then
 * POST /sign with { party, signatureImageKey }.
 *
 * @param {object}   review
 * @param {string}   party       party signing now
 * @param {Function} [onSigned]  called with SignReviewResponseDto
 */
export function SignReviewModal({ review, party, open, onClose, onSigned }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    mutateAsync,
    isPending,
    error: signError,
  } = useSignReview(review?.enrolmentId);
  const busy = isUploading || isPending;

  const handleClose = () => {
    if (busy) return;
    setFile(null);
    setUploadError(null);
    if (fileRef.current) fileRef.current.value = "";
    onClose();
  };

  const handleSign = async () => {
    setUploadError(null);
    if (!file) {
      setUploadError(
        normalizeApiClientError({
          message: "Select a signature image to continue.",
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

      const result = await mutateAsync({
        id: review.id,
        party,
        signatureImageKey,
      });
      onSigned?.(result);
      handleClose();
    } catch (err) {
      setIsUploading(false);
      setUploadError(normalizeApiClientError(err));
    }
  };

  const partyLabel = PARTY_LABELS[party] ?? party;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      busy={busy}
      size="md"
      icon={<PenTool className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={`Sign as ${partyLabel}`}
      description="Upload a signature image (PNG, JPG or WEBP). It is attached to the signed PDF."
      footer={
        <Button
          type="button"
          color="green"
          size="sm"
          loading={busy}
          disabled={busy || !file}
          onClick={handleSign}
          startIcon={<PenTool className="size-4" />}
        >
          {isUploading ? "Uploading…" : "Sign"}
        </Button>
      }
    >
      <div className="space-y-4">
        <ServerErrorAlert error={uploadError || signError} />

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
                Click to choose a signature image
              </span>
              <span className="text-xs text-neutral-400">
                PNG, JPG or WEBP · up to 25 MB
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
            setUploadError(null);
            setFile(e.target.files?.[0] ?? null);
          }}
        />

        <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
          Signing order is sequential: apprentice → tutor → employer manager.
          Each party must be signed in by their assigned account.
        </p>
      </div>
    </Modal>
  );
}
