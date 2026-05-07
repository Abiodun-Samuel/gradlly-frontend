"use client";
import { InputForm } from "@gradlly/ui";

import AuthLayout from "../components/AuthLayout";
export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          Account recovery
        </p>
        <h1 className="text-[34px] font-bold text-[#1b4f32] tracking-tight leading-tight mb-3">
          Reset your password
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Enter the email address linked to your Gradlly account and we&apos;ll
          send you a secure link to create a new password.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
            Email address <span className="text-red-400">*</span>
          </label>
          <InputForm
            name="email"
            placeholder="you@yourorganisation.com"
            error={undefined}
          />
        </div>

        <p className="text-xs text-gray-400 font-light leading-relaxed pt-1">
          We&apos;ll send a reset link to this address if it matches an existing
          account. Check your spam folder if it doesn&apos;t arrive within a few
          minutes.
        </p>

        <button className="w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[15px] bg-[#1b4f32] hover:bg-[#225e3c] transition-all tracking-wide">
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Remembered it?
          <span className="text-[#1b4f32] ml-2 font-semibold cursor-pointer hover:underline">
            Back to login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
