"use client";

import { ExternalLink, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { fmt } from "./helpers";
import { T } from "./tokens";

const STAGES = ["Initiated", "Pending ESFA", "Confirmed", "Active"];

function normaliseStage(status) {
  const map = {
    pending: "Initiated",
    confirmed: "Confirmed",
    active: "Active",
  };
  return map[status?.toLowerCase()] ?? status ?? "Initiated";
}

function Pipeline({ stage }) {
  const idx = STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-0.5 mt-1.5">
      {STAGES.map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-0.5 flex-1 last:flex-none"
        >
          <div
            className="h-1.5 w-1.5 rounded-full shrink-0 transition-colors"
            style={{ backgroundColor: i <= idx ? T.green : T.border2 }}
          />
          {i < STAGES.length - 1 && (
            <div
              className="flex-1 h-px transition-colors"
              style={{ backgroundColor: i < idx ? T.green : T.border2 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PipelineLabel({ stage }) {
  const idx = STAGES.indexOf(stage);
  return (
    <div className="flex justify-between mt-0.5">
      {STAGES.map((s, i) => (
        <span
          key={s}
          className="text-[8px] font-medium"
          style={{ color: i <= idx ? T.green : T.muted }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export function TransferHub({ levy, transfers = [] }) {
  const monthly = levy?.monthly ?? 0;
  const transferred = levy?.transferred ?? 0;
  const transferable = Math.round(monthly * 12 * 0.5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Levy Transfer Hub</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Active SME transfers
            </h2>
          </div>
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            <PlusCircle className="h-3.5 w-3.5" /> New transfer
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            backgroundColor: T.greenLight,
            border: `1px solid ${T.green}18`,
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: T.muted }}
            >
              Transferable balance (50% cap)
            </p>
            <p
              className="text-2xl font-extrabold tabular-nums mt-0.5"
              style={{ color: T.green }}
            >
              {fmt(transferable)}
            </p>
          </div>
          <div className="text-right text-xs" style={{ color: T.subtle }}>
            <p>Used: {fmt(transferred)}</p>
            <p>Remaining: {fmt(Math.max(0, transferable - transferred))}</p>
          </div>
        </div>

        {transfers.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: T.muted }}>
            No active transfers
          </p>
        ) : (
          <div className="space-y-4">
            {transfers.map((t) => {
              const stage = normaliseStage(t.status ?? t.stage);
              const orgName =
                t.recipientOrgName ?? t.org ?? t.recipientName ?? "SME partner";
              const amount = t.amount ?? t.monthlyDrawdown ?? 0;
              const sector = t.standard ?? t.sector ?? "";
              return (
                <div
                  key={t.id}
                  className="rounded-xl p-3.5 space-y-2"
                  style={{
                    backgroundColor: T.card,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: T.ink }}
                      >
                        {orgName}
                      </p>
                      {sector && (
                        <p className="text-xs" style={{ color: T.muted }}>
                          {sector}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-sm font-bold tabular-nums shrink-0"
                      style={{ color: T.green }}
                    >
                      {fmt(amount)}
                    </span>
                  </div>
                  <Pipeline stage={stage} />
                  <PipelineLabel stage={stage} />
                </div>
              );
            })}
          </div>
        )}

        <a
          href="https://flowportal.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
          style={{ color: T.blue }}
        >
          <ExternalLink className="h-3.5 w-3.5" /> FlowPortal Levy Exchange —
          automated SME matching
        </a>
      </CardContent>
    </Card>
  );
}
