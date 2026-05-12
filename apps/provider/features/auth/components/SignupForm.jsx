"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { applyServerErrors } from "../errors";
import { useSignup } from "../queries/auth.query";
import { signupSchema, signupDefaults } from "../schemas";

import { ServerErrorAlert } from "@/components/error/ServerErrorAlert";
import { CheckboxField } from "@/components/form/CheckboxField";
import { InputField } from "@/components/form/InputField";
import Button from "@/components/ui/Button";

export function SignupForm() {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: signupDefaults,
    mode: "onBlur",
  });

  const { mutateAsync, isPending } = useSignup();

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
          Get started: it&apos;s free
        </p>
        <h1 className="text-[34px] font-bold text-[#111815] tracking-tight leading-tight mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 font-normal leading-relaxed">
          Join training providers using Gradlly to streamline learner
          management, reviews, and compliance workflows.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <ServerErrorAlert
          error={serverError}
          onDismiss={() => setServerError(null)}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            name="firstName"
            label="First Name"
            required
            placeholder="John"
            register={register}
            error={errors.firstName?.message}
          />
          <InputField
            name="lastName"
            label="Last Name"
            required
            placeholder="Doe"
            register={register}
            error={errors.lastName?.message}
          />
        </div>

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
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          register={register}
          error={errors.password?.message}
        />

        <CheckboxField
          required
          description="By creating an account you agree to our Terms of Service and Privacy Policy."
          name="acceptTerms"
          label="Terms and Conditions"
          register={register}
          error={errors.acceptTerms?.message}
        />

        <div>
          <Button loading={isSubmitting || isPending} fullWidth type="submit">
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-500 pt-1 pb-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1b4f32] font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
