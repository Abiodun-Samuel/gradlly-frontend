"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";
import { useResetPassword } from "@/features/auth/queries/auth.query";
import {
  resetPasswordDefaults,
  resetPasswordSchema,
} from "@/features/auth/schemas";
import { applyServerErrors } from "@/lib/errors";

/**
 * Reads ?token= from the URL, validates the new password, and calls the
 * reset-password API. Backend only receives { token, password }.
 *
 * Invalid/missing token: renders a clear error state rather than the form.
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending, error: serverError } = useResetPassword();
  const disabled = isSubmitting || isPending;

  const onSubmit = async (values) => {
    try {
      // confirmPassword is UI-only; backend only accepts { token, password }
      await mutateAsync({ token, password: values.newPassword });
    } catch (error) {
      applyServerErrors(error, setError);
    }
  };

  // ── Invalid / missing token state ────────────────────────────────────────
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-red-50 mx-auto">
          <KeyRound aria-hidden="true" className="size-7 text-red-500" />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-neutral-800">
            This link is invalid or has expired.
          </p>
          <p className="text-sm text-neutral-500">
            Password reset links are single-use and expire after 1 hour.
          </p>
        </div>

        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  // ── Reset form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerErrorAlert showFieldList error={serverError} />

      <fieldset disabled={disabled} className="contents space-y-4">
        <InputField
          required
          name="newPassword"
          label="New password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          register={register}
          error={errors.newPassword?.message}
        />

        <InputField
          required
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          register={register}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" loading={disabled} disabled={disabled} fullWidth>
          Reset password
        </Button>
      </fieldset>

      <p className="text-center text-sm text-gray-500 pt-2 pb-4">
        <Link href="/login" className="text-primary-700 font-semibold">
          Back to login
        </Link>
      </p>
    </form>
  );
}
