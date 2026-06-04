"use client";

import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import Button from "@/components/ui/Button";

import { useAcceptInvitation } from "../queries/invitations.query";

function StatusBlock({
  tone = "neutral",
  icon: Icon,
  title,
  description,
  children,
}) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-500",
    primary: "bg-primary-50 text-primary-600 ring-1 ring-primary-100",
    danger: "bg-danger-50 text-danger-600 ring-1 ring-danger-100",
    success: "bg-success-50 text-success-600 ring-1 ring-success-100",
  };
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      {Icon ? (
        <div
          className={`flex size-16 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon className="size-8" strokeWidth={1.5} aria-hidden />
        </div>
      ) : null}
      {title ? (
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          {description ? (
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-500">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/**
 * AcceptInviteInner
 */
function AcceptInviteInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { mutate, isError, isSuccess, error } = useAcceptInvitation();
  const didAccept = useRef(false);

  useEffect(() => {
    if (!token || didAccept.current) return;
    didAccept.current = true;
    mutate({ token });
  }, [token, mutate]);

  // ── Missing token ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <StatusBlock
        tone="primary"
        icon={Mail}
        title="Invalid invitation link"
        description="This link is missing an invitation token. Please check your email for the original invite link."
      >
        <Button href="/" color="green" size="sm">
          Go to dashboard
        </Button>
      </StatusBlock>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <StatusBlock
        tone="danger"
        icon={XCircle}
        title="Invitation failed"
        description={
          error?.message ||
          "This invitation link may have expired or already been used."
        }
      >
        <Button href="/" color="green" size="sm">
          Go to dashboard
        </Button>
      </StatusBlock>
    );
  }

  // ── Success (redirecting to dashboard) ──────────────────────────────────────
  if (isSuccess) {
    return (
      <StatusBlock tone="success" icon={CheckCircle2}>
        <p className="text-sm font-medium text-neutral-700">
          Invitation accepted. Redirecting
        </p>
      </StatusBlock>
    );
  }

  // ── Accepting (idle + pending) ──────────────────────────────────────────────
  return (
    <StatusBlock>
      <Loader2 className="size-8 animate-spin text-primary-500" />
      <p className="text-sm font-medium text-neutral-700">
        Accepting your invitation
      </p>
    </StatusBlock>
  );
}

export function AcceptInviteView() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <Loader2 className="size-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <AcceptInviteInner />
    </Suspense>
  );
}
