"use client";

import { FileCog, Plus, Send } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { formatDate } from "@/utils/helper";

import { IlrConfigStatusBadge } from "./IlrBadges";
import { MappingConfigModal } from "./MappingConfigModal";
import { ILR_CONFIG_STATUS } from "../constants";
import {
  useMappingConfigs,
  usePublishMappingConfig,
} from "../queries/ilr.query";

export function MappingConfigsPanel() {
  const { isOwner, isAdmin } = useRoleAccess();
  const canManage = isOwner || isAdmin;

  const { data: configs = [], isLoading } = useMappingConfigs();
  const publish = usePublishMappingConfig();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCog className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              Mapping configs
            </h2>
          </div>
          {canManage ? (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={() => setCreateOpen(true)}
            >
              New config
            </Button>
          ) : null}
        </div>

        <p className="text-sm text-neutral-500">
          Per-academic-year config mapping domain data to ILR fields +
          validation rules. Records use the published version automatically when
          built.
        </p>

        {isLoading ? (
          <p className="py-4 text-center text-sm text-neutral-400">
            Loading configs…
          </p>
        ) : configs.length === 0 ? (
          <p className="py-4 text-center text-sm text-neutral-400">
            No mapping configs yet.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
            {configs.map((config) => (
              <li
                key={config.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {config.academicYear} · v{config.version}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {config.publishedAt
                      ? `Published ${formatDate(config.publishedAt)}`
                      : `Created ${formatDate(config.createdAt)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <IlrConfigStatusBadge status={config.status} />
                  {canManage && config.status === ILR_CONFIG_STATUS.DRAFT ? (
                    <Button
                      size="xs"
                      color="green"
                      loading={publish.isPending}
                      disabled={publish.isPending}
                      startIcon={<Send className="size-3.5" />}
                      onClick={() => publish.mutate(config.id)}
                    >
                      Publish
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <MappingConfigModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Card>
  );
}
