"use client";
import { InputForm } from "@gradlly/ui";

export default function CreatePasswordPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          Almost there
        </p>
        <h1 className="text-[34px] font-bold text-[#1b4f32] tracking-tight leading-tight mb-3">
          Create a password
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Your account is nearly set up. Choose a strong password to keep your
          Gradlly workspace secure — you&apos;ll use it every time you sign in.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
            Password <span className="text-red-400">*</span>
          </label>
          <InputForm
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            error={undefined}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <InputForm
            name="confirm"
            type="password"
            placeholder="Re-enter your password"
            error={undefined}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 space-y-2">
          <p className="text-xs font-medium text-[#444] tracking-wide mb-1">
            Password requirements
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <span className="w-4 h-4 rounded-full bg-[#e6f5ed] text-[#2d7a50] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              ✓
            </span>
            At least 8 characters long
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <span className="w-4 h-4 rounded-full bg-[#e6f5ed] text-[#2d7a50] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              ✓
            </span>
            One uppercase letter
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <span className="w-4 h-4 rounded-full bg-[#e6f5ed] text-[#2d7a50] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              ✓
            </span>
            One number or special character
          </div>
        </div>

        <button className="w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[15px] bg-[#1b4f32] hover:bg-[#225e3c] transition-all tracking-wide">
          Set Password
        </button>
      </div>
    </>
  );
}
