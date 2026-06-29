"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ENROLMENT_QUERY_KEYS } from "@/features/enrolments/queries/keys";
import { getEnrolments } from "@/features/enrolments/services/enrolments.service";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { APPRENTICE_QUERY_KEYS } from "./keys";
import {
  createApprentice,
  getApprentices,
} from "../services/apprentices.service";

// ─── Avatar colour derived from apprentice id ─────────────────────────────────

const AVATAR_COLORS = [
  "#3b5fe0",
  "#0d7a52",
  "#7c3aed",
  "#b85c0a",
  "#1847d4",
  "#e04b3b",
];

function avatarColor(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - Date.now()) / 86_400_000);
}

function fmtDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Merge one apprentice record with its most-relevant enrolment
function normalizeApprentice(apprentice, enrolment) {
  const first = apprentice.firstName ?? "";
  const last = apprentice.lastName ?? "";
  return {
    // Core identity
    id: apprentice.id,
    name: `${first} ${last}`.trim(),
    initials: `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?",
    avatarColor: avatarColor(apprentice.id),
    email: apprentice.email,
    apprenticeStatus: apprentice.status, // pending|active|paused|completed|withdrawn
    employeeId: null, // not in API

    // Programme — from enrolment
    enrolmentId: enrolment?.id ?? null,
    standardId: enrolment?.standardId ?? null,
    standard: "—", // name lookup not available from list endpoint
    status: enrolment?.otjPaceAlertLevel ?? "on_track",
    epaDate: fmtDate(enrolment?.epaDate) ?? "—",
    epaDaysLeft: daysUntil(enrolment?.epaDate),
    startDate: fmtDate(enrolment?.plannedStartDate),
    expectedEndDate: fmtDate(enrolment?.plannedEndDate),
    levyCost: enrolment?.agreedPrice ?? 0,
    fundingBand: enrolment?.agreedPrice ?? 0,
    pipelineState: enrolment?.pipelineState ?? null,

    // Unavailable from these endpoints — rendered as "—" / null
    cohort: null,
    provider: "—",
    tutorName: null,
    tutorEmail: null,
    lineManager: null,
    lineManagerEmail: null,
    providerContact: { name: "—", email: "—", phone: "—" },
    lastActivity: null,
    attendance: null,
    otjActual: null,
    otjExpected: null,
    otjHoursCompleted: null,
    otjHoursRequired: null,
    commitmentSigned: false,
    milestones: [],
    recentActivity: [],
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useApprenticeRoster() {
  const { orgId } = useAuthUser();

  const apprenticesQ = useQuery({
    queryKey: APPRENTICE_QUERY_KEYS.list(orgId),
    queryFn: () => getApprentices({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => ({ data: r?.data ?? [], meta: r?.meta ?? null }),
  });

  const enrolmentsQ = useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId),
    queryFn: () => getEnrolments({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });

  const apprenticesData = apprenticesQ.data;
  const enrolmentsData = enrolmentsQ.data;

  const roster = useMemo(() => {
    const apprentices = apprenticesData?.data ?? [];
    const enrolments = enrolmentsData ?? [];

    // Map apprenticeId → best enrolment (prefer active over draft/cancelled)
    const byApprentice = {};
    for (const e of enrolments) {
      const existing = byApprentice[e.apprenticeId];
      if (!existing || e.status === "active") {
        byApprentice[e.apprenticeId] = e;
      }
    }

    return apprentices.map((a) =>
      normalizeApprentice(a, byApprentice[a.id] ?? null),
    );
  }, [apprenticesData, enrolmentsData]);

  return {
    roster,
    meta: apprenticesQ.data?.meta ?? null,
    isLoading: apprenticesQ.isLoading || enrolmentsQ.isLoading,
    isError: apprenticesQ.isError || enrolmentsQ.isError,
  };
}

export function useCreateApprentice() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createApprentice({ orgId, body }),
    onSuccess: () => {
      toastSuccess("Apprentice added to your roster.");
      qc.invalidateQueries({ queryKey: APPRENTICE_QUERY_KEYS.list(orgId) });
    },
    onError: (error) => {
      toastError(error.message || "Failed to create apprentice.");
    },
  });
}
