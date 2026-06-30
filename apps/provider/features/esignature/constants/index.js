export const ESIGNATURE_PATHS = Object.freeze({
  records: "/api/v1/esignature/records",
  recordById: (id) => `/api/v1/esignature/records/${id}`,
  sign: (id) => `/api/v1/esignature/records/${id}/sign`,
});

// ─── Record status (`SignatureRecordStatus`) ─────────────────────────────────
export const SIGNATURE_STATUS = Object.freeze({
  PENDING: "pending",
  SIGNED: "signed",
  FAILED: "failed", // terminal — cannot retry; create a new record
});

export const SIGNATURE_STATUS_LABELS = Object.freeze({
  pending: "Pending",
  signed: "Signed",
  failed: "Failed",
});

// The PDF source is mutually exclusive: a completed PDF job OR an existing key.
export const PDF_SOURCE = Object.freeze({
  JOB: "job",
  KEY: "key",
});

// Actions available for a record by status.
export function getSignatureActions(record) {
  const status = record?.status ?? null;
  return {
    sign: status === SIGNATURE_STATUS.PENDING,
    download: status === SIGNATURE_STATUS.SIGNED && !!record?.signedPdfKey,
    failed: status === SIGNATURE_STATUS.FAILED,
  };
}
