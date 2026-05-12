import OtpInput from "@/features/auth/components/OtpInput";

export default function VerifyEmailPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          One last step
        </p>
        <h1 className="text-[34px] font-bold text-[#1b4f32] tracking-tight leading-tight mb-3">
          Verify your email
        </h1>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          We sent a 6-digit verification code to
          <span className="text-[#1b4f32] font-medium">your mail</span>. Enter
          it below to confirm your identity and activate your Gradlly account.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#444] mb-3 tracking-wide">
            Verification code <span className="text-red-400">*</span>
          </label>
          <OtpInput />
        </div>

        <p className="text-xs text-gray-400 font-light leading-relaxed pt-1">
          The code expires in{" "}
          <span className="text-[#1b4f32] font-medium">10 minutes</span>. If you
          don&apos;t see the email, check your spam or junk folder before
          requesting a new one.
        </p>

        <button className="w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[15px] bg-[#1b4f32] hover:bg-[#225e3c] transition-all tracking-wide">
          Verify Email
        </button>

        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5">
          <p className="text-xs font-medium text-[#444] tracking-wide mb-1">
            Didn&apos;t receive the code?
          </p>
          <p className="text-xs text-gray-400 font-light leading-relaxed mb-2.5">
            It can take up to a minute to arrive. If it still hasn&apos;t shown
            up, you can request a fresh one.
          </p>
          <span className="text-xs text-[#1b4f32] font-semibold cursor-pointer hover:underline">
            Resend code
            <span className="text-gray-400 mr-1font-light">(00:45)</span>
          </span>
        </div>
      </div>
    </>
  );
}
