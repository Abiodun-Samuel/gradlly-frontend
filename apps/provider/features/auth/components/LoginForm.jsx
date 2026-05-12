"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { applyServerErrors } from "../errors";
import { useLogin } from "../queries/auth.query";
import { loginSchema, loginDefaults } from "../schemas";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";

export function LoginForm() {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending } = useLogin();

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      await mutateAsync(values);
    } catch (error) {
      applyServerErrors(error, setError);
      setServerError(error);
    }
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          Welcome back
        </p>
        <h1 className="text-[34px] font-bold text-[#111815] tracking-tight leading-tight mb-3">
          Log in to Gradlly
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <ServerErrorAlert
          error={serverError}
          onDismiss={() => setServerError(null)}
        />

        <InputField
          required
          name="email"
          label="Email"
          type="email"
          placeholder="you@yourorganisation.com"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />

        <InputField
          required
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          register={register}
          error={errors.password?.message}
        />

        <Button type="submit" loading={isSubmitting || isPending} fullWidth>
          Log in
        </Button>

        <p className="text-center text-sm text-gray-500 pt-2 pb-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#1b4f32] font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
