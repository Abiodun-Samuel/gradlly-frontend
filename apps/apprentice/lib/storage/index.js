import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const STORAGE_PATHS = {
  UPLOAD_URL: "/api/v1/storage/upload-url",
};

/** POST to the backend to get a presigned S3 upload URL. */
export async function requestUploadUrl(payload) {
  try {
    const result = await $apiClient.post(STORAGE_PATHS.UPLOAD_URL, payload);
    return result.data?.data ?? result.data;
  } catch (err) {
    throw normalizeApiClientError(err);
  }
}

/**
 * PUT a file directly to S3 using a presigned URL.
 * Uses XMLHttpRequest so upload progress can be reported.
 *
 * @param {string}   uploadUrl  Presigned S3 URL
 * @param {File}     file       Browser File object
 * @param {(pct: number) => void} onProgress  Called with 0–100
 */
export function putFileToS3(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error — check your connection and try again.")),
    );
    xhr.addEventListener("abort", () =>
      reject(new Error("Upload was cancelled.")),
    );

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );
    xhr.send(file);
  });
}
