"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { T } from "./tokens";

export function ApprenticeTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Cost Per Apprentice</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Active programme costs
            </h2>
          </div>
          <Link
            href="/apprentices"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            <PlusCircle className="h-3.5 w-3.5" /> Add
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center py-10 gap-2 rounded-xl"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <p className="text-sm font-semibold" style={{ color: T.ink }}>
            Cost breakdown pending
          </p>
          <p
            className="text-xs text-center max-w-[220px]"
            style={{ color: T.muted }}
          >
            Per-apprentice levy costs will appear here once enrolment data is
            available.
          </p>
          <Link
            href="/apprentices"
            className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            View apprentices →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
