"use client";
import { InputForm } from "@gradlly/ui";
import Link from "next/link";

import AuthLayout from "../components/AuthLayout";
import SocialButtons from "../components/SocialButtons";

export default function page() {
  return (
    <AuthLayout>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          Welcome back
        </p>
        <h1 className="text-[34px] font-bold text-[#1b4f32] tracking-tight leading-tight mb-3">
          Login to Gradlly
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Continue managing your apprenticeship programs, tracking learner
          progress, and collaborating with your team — all in one place.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
            Email <span className="text-red-400">*</span>
          </label>
          <InputForm name="email" placeholder="Enter your mail address" />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
            Password <span className="text-red-400">*</span>
          </label>
          <InputForm
            name="password"
            type="password"
            placeholder="Enter password"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-[#1b4f32] cursor-pointer"
            />
            Remember me
          </label>
          <Link
            href="/reset-password"
            className="text-sm text-[#2d7a50] font-medium pt-3"
          >
            Forgot your password?
          </Link>
        </div>

        <button className="w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[15px] bg-[#1b4f32] hover:bg-[#225e3c] transition-all tracking-wide">
          Log In
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 tracking-wider">
            Or Login with
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <SocialButtons />

        <p className="text-center text-sm text-gray-500 pt-2">
          Don&apos;t have an account?
          <Link href="/signup" className="text-[#1b4f32] font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
