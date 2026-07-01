"use client";

import { Layers, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoBackButton } from "@/components/ui/GoBackButton";
import TextBadge from "@/components/ui/TextBadge";

import { EnrolApprenticeModal } from "./EnrolApprenticeModal";
import { useAiProgramme } from "../queries/ai-programmes.query";

function ModuleRow({ module, index }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500">
        {index + 1}
      </span>
      <div className="min-w-0">
        <p className="font-medium text-neutral-900">{module.title}</p>
        {module.description ? (
          <p className="mt-0.5 text-sm text-neutral-500">
            {module.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function AiProgrammeDetail({ programmeId }) {
  const { data: programme, isLoading, error } = useAiProgramme(programmeId);
  const [enrolOpen, setEnrolOpen] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading programme…</p>;
  }

  if (error || !programme) {
    return (
      <div className="space-y-4">
        <GoBackButton />
        <EmptyState
          icon={Sparkles}
          title="Programme not found"
          description="This programme isn't in your AI catalogue."
        />
      </div>
    );
  }

  const modules = programme.modules ?? [];

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
            <Sparkles className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                {programme.title}
              </h1>
              <TextBadge variant="light" color="purple" size="xs">
                AI delivered
              </TextBadge>
            </div>
            {programme.code ? (
              <p className="mt-0.5 text-xs text-neutral-400">
                {programme.code}
              </p>
            ) : null}
            {programme.description ? (
              <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                {programme.description}
              </p>
            ) : null}
          </div>
        </div>
        <Button
          color="green"
          onClick={() => setEnrolOpen(true)}
          startIcon={<UserPlus className="size-4" />}
        >
          Enrol apprentice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <Layers className="size-4 text-neutral-400" aria-hidden />
            Module outline · {modules.length}
          </h2>
        </CardHeader>
        <CardContent>
          {modules.length ? (
            <ul className="divide-y divide-neutral-100">
              {modules.map((module, index) => (
                <ModuleRow key={module.slug} module={module} index={index} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">
              No modules published for this programme yet.
            </p>
          )}
        </CardContent>
      </Card>

      <EnrolApprenticeModal
        programmeId={programmeId}
        open={enrolOpen}
        onClose={() => setEnrolOpen(false)}
      />
    </div>
  );
}
