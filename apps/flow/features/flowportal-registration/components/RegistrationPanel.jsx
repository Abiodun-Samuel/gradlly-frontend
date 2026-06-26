"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { formatDateTime } from "@/utils/helper";

import { REGISTRATION_RESUME_TOKEN_KEY } from "../constants";
import {
  useCreateRegistrationSession,
  useRegistrationSession,
} from "../queries/registration.query";

export function RegistrationPanel() {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REGISTRATION_RESUME_TOKEN_KEY);
  });

  const {
    mutate,
    isPending,
    data: created,
  } = useCreateRegistrationSession({
    onSuccess: (data) => {
      if (data?.resumeToken) {
        window.localStorage.setItem(
          REGISTRATION_RESUME_TOKEN_KEY,
          data.resumeToken,
        );
        setToken(data.resumeToken);
      }
    },
  });
  const activeToken = created?.resumeToken ?? token;
  const { data: session, isLoading } = useRegistrationSession(activeToken, {
    enabled: !!activeToken,
  });

  const handleStart = () => {
    mutate({});
  };

  const display = session ?? created;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="eyebrow">Registration</p>
          <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
            ESFA employer registration
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {!display ? (
            <Button onClick={handleStart} loading={isPending}>
              Start registration wizard
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <TextBadge variant="light" color="blue" size="xs">
                  {display.status?.replace(/_/g, " ")}
                </TextBadge>
                <TextBadge variant="light" color="purple" size="xs">
                  Step: {display.currentStep?.replace(/_/g, " ")}
                </TextBadge>
              </div>
              <p className="text-sm text-neutral-600">
                Session expires{" "}
                <span className="font-medium text-neutral-900">
                  {display.expiresAt ? formatDateTime(display.expiresAt) : "—"}
                </span>
              </p>
              {display.completedAt ? (
                <p className="text-sm text-success-700">
                  Completed {formatDateTime(display.completedAt)}
                </p>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleStart}
                  loading={isPending}
                >
                  Start new session
                </Button>
              )}
            </div>
          )}
          {isLoading && display ? (
            <p className="text-xs text-neutral-400">Refreshing session…</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
