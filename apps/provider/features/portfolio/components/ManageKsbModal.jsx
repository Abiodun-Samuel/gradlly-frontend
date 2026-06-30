"use client";

import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/utils/helper";

import { DeleteKsbDefinitionModal } from "./DeleteKsbDefinitionModal";
import { KsbDefinitionFormModal } from "./KsbDefinitionFormModal";
import { KsbKindBadge } from "./PortfolioBadges";
import { useKsbDefinitions } from "../queries/portfolio.query";

/**
 * Manage the KSB definitions for one standard: list + add/edit/delete.
 * Launched from the standards table.
 *
 * @param {object} standard   the standard whose KSBs are managed
 */
export function ManageKsbModal({ standard, open, onClose }) {
  const standardId = standard?.id;
  const { data: definitions = [], isLoading } = useKsbDefinitions(standardId, {
    enabled: open && !!standardId,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (def) => {
    setEditTarget(def);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  // Sort by sortOrder then code for stable display.
  const sorted = [...definitions].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
      String(a.code).localeCompare(String(b.code)),
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="2xl"
        icon={
          <ListChecks className="size-4.5" strokeWidth={1.85} aria-hidden />
        }
        title="Manage KSBs"
        description={
          standard
            ? `Knowledge, Skills & Behaviours for ${standard.title} (${standard.code})`
            : undefined
        }
        hideCancel
        footer={
          <Button
            type="button"
            color="green"
            size="sm"
            startIcon={<Plus className="size-4" />}
            onClick={openCreate}
          >
            Add KSB
          </Button>
        }
      >
        {isLoading ? (
          <p className="py-6 text-center text-sm text-neutral-400">
            Loading KSBs…
          </p>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <ListChecks className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                No KSBs yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Add the Knowledge, Skills and Behaviours apprentices will
                evidence.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {sorted.map((def) => (
              <li
                key={def.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-xs font-semibold text-neutral-700",
                    )}
                  >
                    {def.code}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {def.title}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <KsbKindBadge kind={def.kind} />
                  <button
                    type="button"
                    onClick={() => openEdit(def)}
                    title="Edit KSB"
                    className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(def)}
                    title="Delete KSB"
                    className="rounded-lg p-1.5 text-danger-500 transition-colors hover:bg-danger-50 hover:text-danger-700"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <KsbDefinitionFormModal
        open={formOpen}
        onClose={closeForm}
        standardId={standardId}
        definition={editTarget}
      />
      <DeleteKsbDefinitionModal
        definition={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
