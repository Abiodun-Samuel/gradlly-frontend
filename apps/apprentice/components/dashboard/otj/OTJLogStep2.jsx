import { FileUpload } from "@/components/ui/FileUpload";

export function OTJLogStep2({
  uploads,
  onAddFiles,
  onRemoveFile,
  onRetryFile,
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500 leading-relaxed">
        Attach supporting evidence for this session. This is{" "}
        <span className="font-medium text-neutral-700">optional</span> you can
        add files later.
      </p>

      <FileUpload
        uploads={uploads}
        onAddFiles={onAddFiles}
        onRemoveFile={onRemoveFile}
        onRetryFile={onRetryFile}
        maxFiles={5}
        maxSizeMb={10}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
      />
    </div>
  );
}
