"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getActiveOrgId } from "@/lib/api/active-org";
import { normalizeApiClientError } from "@/lib/errors";
import { putFileToS3, requestUploadUrl } from "@/lib/storage";

function makeEntry(file) {
  return {
    id: crypto.randomUUID(),
    file,
    key: null,
    status: "idle",
    progress: 0,
    error: null,
  };
}

export function useFileUpload(config) {
  const [uploads, setUploads] = useState([]);

  const uploadsRef = useRef([]);
  useEffect(() => {
    uploadsRef.current = uploads;
  });

  const patch = useCallback(
    (id, update) =>
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...update } : u)),
      ),
    [],
  );

  const startUpload = useCallback(
    async (entry) => {
      const { id, file } = entry;

      // Step 1 — Request a presigned URL
      patch(id, { status: "requesting-url" });

      let uploadUrl;
      let key;

      const organisationId = config.orgId ?? getActiveOrgId();
      if (!organisationId) {
        patch(id, {
          status: "error",
          error:
            "Your training provider organisation is not loaded yet. Wait a moment and retry.",
        });
        return;
      }

      try {
        const data = await requestUploadUrl(
          {
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            contentLength: file.size,
            category: config.category,
            learnerId: config.learnerId,
          },
          organisationId,
        );
        uploadUrl = data.uploadUrl;
        key = data.key;
      } catch (err) {
        const e = normalizeApiClientError(err);
        patch(id, { status: "error", error: e.message });
        return;
      }

      // Step 2 — PUT directly to S3 with progress
      patch(id, { status: "uploading", progress: 0 });

      try {
        await putFileToS3(uploadUrl, file, (progress) =>
          patch(id, { progress }),
        );
        patch(id, { status: "done", key, progress: 100 });
      } catch (err) {
        patch(id, {
          status: "error",
          error:
            err instanceof Error
              ? err.message
              : "Upload failed. Please try again.",
        });
      }
    },
    [config, patch],
  );

  const addFiles = useCallback(
    (incoming) => {
      const { maxFiles = 5, maxSizeMb = 10 } = config;
      const current = uploadsRef.current;
      const slotsLeft = maxFiles - current.length;

      const toAdd = [];

      for (const file of incoming) {
        if (toAdd.length >= slotsLeft) break;

        if (file.size > maxSizeMb * 1024 * 1024) {
          toAdd.push({
            ...makeEntry(file),
            status: "error",
            error: `Exceeds the ${maxSizeMb} MB limit.`,
          });
          continue;
        }

        const duplicate = current.some(
          (u) => u.file.name === file.name && u.file.size === file.size,
        );
        if (duplicate) continue;

        toAdd.push(makeEntry(file));
      }

      if (toAdd.length === 0) return;

      setUploads((prev) => [...prev, ...toAdd]);
      toAdd.filter((e) => e.status === "idle").forEach((e) => startUpload(e));
    },
    [config, startUpload],
  );

  const removeFile = useCallback((id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const retryFile = useCallback(
    (id) => {
      const entry = uploadsRef.current.find((u) => u.id === id);
      if (!entry || entry.status !== "error") return;

      const reset = { ...entry, status: "idle", progress: 0, error: null };
      setUploads((prev) => prev.map((u) => (u.id === id ? reset : u)));
      startUpload(reset);
    },
    [startUpload],
  );

  const reset = useCallback(() => setUploads([]), []);

  const uploadedKeys = uploads
    .filter((u) => u.status === "done" && u.key !== null)
    .map((u) => u.key);

  const isUploading = uploads.some(
    (u) => u.status === "requesting-url" || u.status === "uploading",
  );

  return {
    uploads,
    addFiles,
    removeFile,
    retryFile,
    uploadedKeys,
    isUploading,
    reset,
  };
}
