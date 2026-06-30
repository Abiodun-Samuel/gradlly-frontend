"use client";

import { Check, Loader2, Shield } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { STORAGE_CATEGORY } from "@/features/storage/services/storage.service";
import { cn } from "@/utils/helper";

import { FileUploadButton } from "./FileUploadButton";
import {
  useCompleteSafeguardingItem,
  useSafeguardingChecklist,
} from "../queries/ofsted.query";

function ChecklistItem({ item, canManage }) {
  const { mutate, isPending } = useCompleteSafeguardingItem();
  // Locally remember an uploaded evidence key to attach when ticking.
  const [pendingKey, setPendingKey] = useState(null);

  const complete = (evidenceStorageKey) =>
    mutate({ slug: item.slug, evidenceStorageKey });

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <button
        type="button"
        disabled={item.completed || !canManage || isPending}
        onClick={() => complete(pendingKey || undefined)}
        aria-label={
          item.completed
            ? `${item.label} completed`
            : `Mark ${item.label} complete`
        }
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          item.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-neutral-300 bg-white hover:border-primary-400",
          (item.completed || !canManage) && "cursor-default",
        )}
      >
        {isPending ? (
          <Loader2 className="size-3 animate-spin" aria-hidden />
        ) : item.completed ? (
          <Check className="size-3.5" aria-hidden />
        ) : null}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            item.completed
              ? "text-neutral-500 line-through"
              : "text-neutral-800",
          )}
        >
          {item.label}
        </p>
        {item.completed && item.completedAt ? (
          <p className="text-xs text-neutral-400">
            Completed {new Date(item.completedAt).toLocaleDateString("en-GB")}
          </p>
        ) : canManage ? (
          <div className="mt-1.5">
            <FileUploadButton
              category={STORAGE_CATEGORY.ATTACHMENT}
              label="Attach evidence (optional)"
              uploaded={!!pendingKey}
              onUploaded={setPendingKey}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function SafeguardingChecklist({ canManage = true }) {
  const { data: items = [], isLoading } = useSafeguardingChecklist();
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Safeguarding checklist
          </h2>
        </div>
        {items.length ? (
          <span className="text-xs font-medium text-neutral-500">
            {completedCount}/{items.length} complete
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading checklist…
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((item) => (
              <ChecklistItem
                key={item.slug}
                item={item}
                canManage={canManage}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
