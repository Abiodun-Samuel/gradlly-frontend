import { T } from "@/components/dashboard/levy/tokens";

export function OTJSummaryBanner({ pending, onBulkApprove }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-start justify-between gap-4 flex-wrap"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="space-y-1">
        <p className="text-sm font-bold" style={{ color: T.ink }}>
          {pending} entries awaiting approval
        </p>
        <p className="text-xs" style={{ color: T.amber }}>
          ⚠ Oldest entry: 14 days ago — Tom Griffiths
        </p>
        <p className="text-xs" style={{ color: T.muted }}>
          Next weekly digest: Monday 07 Apr · 08:00 GMT
        </p>
      </div>
      <button
        type="button"
        onClick={onBulkApprove}
        disabled={pending === 0}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40 w-full sm:w-auto"
        style={{ backgroundColor: T.green, color: "#fff" }}
      >
        ✓ Approve all ({pending})
      </button>
    </div>
  );
}
