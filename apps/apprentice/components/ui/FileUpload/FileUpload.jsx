"use client";

import {
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/utils/helper";

// ─── File-type icon helper ────────────────────────────────────────────────────

function getFileTypeStyle(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext))
    return {
      Icon: ImageIcon,
      iconClass: "text-info-600",
      bgClass: "bg-info-50 border-info-100",
    };

  if (ext === "pdf")
    return {
      Icon: FileText,
      iconClass: "text-danger-600",
      bgClass: "bg-danger-50 border-danger-100",
    };

  if (["doc", "docx"].includes(ext))
    return {
      Icon: FileText,
      iconClass: "text-info-600",
      bgClass: "bg-info-50 border-info-100",
    };

  if (["xls", "xlsx", "csv"].includes(ext))
    return {
      Icon: FileText,
      iconClass: "text-success-600",
      bgClass: "bg-success-50 border-success-100",
    };

  return {
    Icon: FileIcon,
    iconClass: "text-neutral-500",
    bgClass: "bg-neutral-100 border-neutral-200",
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Single file row ──────────────────────────────────────────────────────────

function FileRow({ upload, onRemove, onRetry }) {
  const { file, status, progress, error } = upload;
  const { Icon, iconClass, bgClass } = getFileTypeStyle(file.name);

  const isPending = status === "requesting-url" || status === "uploading";
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        isDone && "border-success-200 bg-success-50/40",
        isError && "border-danger-200 bg-danger-50/40",
        (isPending || status === "idle") && "border-neutral-200 bg-white",
      )}
    >
      {/* File type icon */}
      <div
        className={cn(
          "shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border",
          bgClass,
        )}
      >
        <Icon size={18} className={iconClass} />
      </div>

      {/* Name + status */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-800">
          {file.name}
        </p>

        {isPending && (
          <div className="mt-1.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>
                {status === "requesting-url"
                  ? "Getting upload URL…"
                  : `Uploading… ${progress}%`}
              </span>
              <span>{formatBytes(file.size)}</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-200"
                style={{
                  width: status === "requesting-url" ? "8%" : `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {isDone && (
          <p className="mt-0.5 text-xs text-success-600">
            {formatBytes(file.size)} · Uploaded
          </p>
        )}

        {isError && <p className="mt-0.5 text-xs text-danger-600">{error}</p>}

        {status === "idle" && (
          <p className="mt-0.5 text-xs text-neutral-400">
            {formatBytes(file.size)}
          </p>
        )}
      </div>

      {/* Status icon + actions */}
      <div className="shrink-0 flex items-center gap-1.5">
        {isPending && (
          <Loader2 size={16} className="animate-spin text-primary-500" />
        )}
        {isDone && <CheckCircle2 size={16} className="text-success-500" />}

        {isError && (
          <>
            <AlertCircle size={15} className="text-danger-500" />
            <button
              type="button"
              onClick={onRetry}
              title="Retry upload"
              className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <RefreshCw size={13} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onRemove}
          title="Remove file"
          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({ accept, multiple, dragging, hint, onFiles, onDragChange }) {
  const inputRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault();
    onDragChange(false);
    onFiles(Array.from(e.dataTransfer.files));
  }

  function handleChange(e) {
    onFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload files"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        onDragChange(true);
      }}
      onDragLeave={() => onDragChange(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-colors select-none",
        dragging
          ? "border-primary-400 bg-primary-50"
          : "border-neutral-200 bg-neutral-50 hover:border-primary-300 hover:bg-primary-50/50",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          dragging ? "bg-primary-100" : "border border-neutral-200 bg-white",
        )}
      >
        <Upload
          size={20}
          className={dragging ? "text-primary-600" : "text-neutral-400"}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-700">
          {dragging ? "Drop files here" : "Drag files here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-neutral-400">{hint}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FileUpload({
  uploads,
  onAddFiles,
  onRemoveFile,
  onRetryFile,
  maxFiles = 5,
  maxSizeMb = 10,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp",
  hint,
  className,
}) {
  const [dragging, setDragging] = useState(false);

  const resolvedHint =
    hint ??
    `PDF, Word, Excel, images · max ${maxSizeMb} MB · up to ${maxFiles} files`;

  const canAddMore = uploads.length < maxFiles;
  const doneCount = uploads.filter((u) => u.status === "done").length;

  return (
    <div className={cn("space-y-3", className)}>
      {canAddMore && (
        <DropZone
          accept={accept}
          multiple={maxFiles > 1}
          dragging={dragging}
          hint={resolvedHint}
          onFiles={onAddFiles}
          onDragChange={setDragging}
        />
      )}

      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {uploads.length} file{uploads.length !== 1 ? "s" : ""} attached
            </p>
            {doneCount > 0 && (
              <p className="text-xs text-success-600 font-medium">
                {doneCount} uploaded
              </p>
            )}
          </div>

          {uploads.map((u) => (
            <FileRow
              key={u.id}
              upload={u}
              onRemove={() => onRemoveFile(u.id)}
              onRetry={() => onRetryFile(u.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
