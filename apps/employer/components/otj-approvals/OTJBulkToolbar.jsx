import { T } from "@/components/dashboard/levy/tokens";

export function OTJBulkToolbar({ count, onApprove, onReject, onClear }) {
  if (count === 0) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{ backgroundColor: T.ink, animation: "slide-up 300ms ease both" }}
    >
      <span className="text-xs font-bold text-white">
        {count} entries selected
      </span>
      <div className="w-px h-4 bg-white/20" />
      <button
        type="button"
        onClick={onApprove}
        className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
        style={{ backgroundColor: T.green, color: "#fff" }}
      >
        ✓ Approve selected
      </button>
      <button
        type="button"
        onClick={onReject}
        className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-80 transition-opacity"
        style={{ borderColor: T.red, color: T.red }}
      >
        ✗ Reject selected
      </button>
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
      >
        Clear ×
      </button>
    </div>
  );
}
