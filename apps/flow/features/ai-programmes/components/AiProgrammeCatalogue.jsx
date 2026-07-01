"use client";

import { BookOpen, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import TextBadge from "@/components/ui/TextBadge";

import { useAiProgrammeCatalogue } from "../queries/ai-programmes.query";

function ProgrammeCard({ programme }) {
  return (
    <Link
      href={`/courses/${programme.id}`}
      className="group block rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
          <Sparkles className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <TextBadge variant="light" color="purple" size="xs">
          AI delivered
        </TextBadge>
      </div>
      <h3 className="mt-4 font-semibold text-neutral-900 group-hover:text-primary-700">
        {programme.title}
      </h3>
      {programme.code ? (
        <p className="mt-0.5 text-xs text-neutral-400">{programme.code}</p>
      ) : null}
      {programme.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
          {programme.description}
        </p>
      ) : null}
      <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
        <Layers className="size-3.5" aria-hidden />
        {programme.moduleCount ?? 0}{" "}
        {programme.moduleCount === 1 ? "module" : "modules"}
      </p>
    </Link>
  );
}

export function AiProgrammeCatalogue() {
  const { data: programmes = [], isLoading } = useAiProgrammeCatalogue();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="h-40 animate-pulse bg-neutral-50" />
          </Card>
        ))}
      </div>
    );
  }

  if (programmes.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No AI programmes available"
        description="The FlowPortal AI catalogue is empty for your organisation."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programmes.map((programme) => (
        <ProgrammeCard key={programme.id} programme={programme} />
      ))}
    </div>
  );
}
