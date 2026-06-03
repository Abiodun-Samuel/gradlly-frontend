"use client";

import { Clock, Mail, RefreshCw, Trash2, UserPlus, Users } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { cn } from "@/utils/helper";

import { INVITATION_ROLE_LABELS } from "../constants";
import { InviteModal } from "./InviteModal";
import { RevokeConfirmDialog } from "./RevokeConfirmDialog";
import {
  useInvitations,
  useResendInvitation,
} from "../queries/invitations.query";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function formatExpiry(expiresAt) {
  if (!expiresAt) return "No expiry";
  const date = new Date(expiresAt);
  const diffMs = date - new Date();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0) {
    const ago = Math.abs(diffDays);
    return ago === 1 ? "Expired yesterday" : `Expired ${ago} days ago`;
  }
  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "Expires tomorrow";
  return `Expires in ${diffDays} days`;
}

function getInitials(firstName, lastName) {
  return `${(firstName ?? "")[0] ?? ""}${(lastName ?? "")[0] ?? ""}`.toUpperCase();
}

const ROLE_STYLES = {
  owner: "bg-violet-50 text-violet-700 ring-violet-200",
  admin: "bg-blue-50 text-blue-700 ring-blue-200",
  member: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function RoleBadge({ role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        ROLE_STYLES[role] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200",
      )}
    >
      {INVITATION_ROLE_LABELS[role] ?? role}
    </span>
  );
}

function StatusCell({ expiresAt }) {
  const expired = isExpired(expiresAt);
  return (
    <div className="inline-flex flex-col items-end gap-0.5 md:items-start">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
          expired
            ? "bg-danger-50 text-danger-600 ring-danger-200"
            : "bg-warning-50 text-warning-700 ring-warning-200",
        )}
      >
        <Clock className="size-3 shrink-0" aria-hidden />
        {expired ? "Expired" : "Pending"}
      </span>
      <span className="text-xs text-neutral-400">
        {formatExpiry(expiresAt)}
      </span>
    </div>
  );
}

function EmailCell({ invitation }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700 ring-1 ring-primary-100">
        {getInitials(
          invitation.invitedBy?.firstName,
          invitation.invitedBy?.lastName,
        ) || <Mail className="size-4 text-primary-400" />}
      </div>
      <span className="truncate font-medium text-neutral-900">
        {invitation.email}
      </span>
    </div>
  );
}

function RowActions({ invitation, onRevoke }) {
  const { mutate: resend, isPending: isResending } = useResendInvitation();
  const expired = isExpired(invitation.expiresAt);

  return (
    <div className="flex items-center justify-end gap-1">
      {!expired ? (
        <button
          type="button"
          disabled={isResending}
          onClick={() => resend(invitation.id)}
          title="Resend invitation"
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
            "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <RefreshCw
            className={cn("size-3.5", isResending && "animate-spin")}
            aria-hidden
          />
          Resend
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onRevoke(invitation)}
        title="Revoke invitation"
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700"
      >
        <Trash2 className="size-3.5" aria-hidden />
        Revoke
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InvitationsTable() {
  const { canManageInvitations } = useAuthUser();
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);

  const { data, isLoading, isFetching } = useInvitations({ page });
  const invitations = data?.invitations ?? [];
  const meta = data?.meta ?? null;

  const columns = [
    {
      key: "email",
      header: "Member",
      primary: true,
      cell: (row) => <EmailCell invitation={row} />,
    },
    {
      key: "role",
      header: "Role",
      mobileLabel: "Role",
      cell: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "invitedBy",
      header: "Invited by",
      mobileLabel: "Invited by",
      cell: (row) =>
        row.invitedBy
          ? `${row.invitedBy.firstName} ${row.invitedBy.lastName}`
          : "Unknown",
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <StatusCell expiresAt={row.expiresAt} />,
    },
    ...(canManageInvitations
      ? [
          {
            key: "actions",
            header: "Actions",
            align: "right",
            mobileLabel: "Actions",
            cell: (row) => (
              <RowActions invitation={row} onRevoke={setRevokeTarget} />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* ── Section header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Pending invitations
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Invitations that have been sent but not yet accepted.
          </p>
        </div>
        {canManageInvitations ? (
          <Button
            size="sm"
            color="green"
            startIcon={<UserPlus className="size-4" />}
            onClick={() => setInviteOpen(true)}
          >
            Invite member
          </Button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={invitations}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        empty={{
          icon: Users,
          title: "No pending invitations",
          description: canManageInvitations
            ? "Invite team members to collaborate on your organisation."
            : "There are no pending invitations at this time.",
          action: canManageInvitations ? (
            <Button
              size="sm"
              color="green"
              startIcon={<UserPlus className="size-4" />}
              onClick={() => setInviteOpen(true)}
            >
              Invite member
            </Button>
          ) : null,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <RevokeConfirmDialog
        invitation={revokeTarget}
        open={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
      />
    </div>
  );
}
