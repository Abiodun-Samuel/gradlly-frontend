import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return <LoginForm />;
  // <div className="w-full">
  //   <header className="mb-10">
  //     <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d7a50] mb-3">
  //       Welcome back
  //     </span>
  //     <h1 className="text-[28px] sm:text-[32px] font-bold text-[#141f18] tracking-tight leading-[1.15] mb-3">
  //       Sign in to Gradlly
  //     </h1>
  //     <p className="text-[13px] text-gray-500 leading-relaxed">
  //       Continue managing your programs, tracking learner progress, and
  //       collaborating with your team.
  //     </p>
  //   </header>

  //   <form className="space-y-5" noValidate>
  //     <div className="space-y-1.5">
  //       <label
  //         htmlFor="email"
  //         className="block text-[12px] font-medium text-[#3a3a3a] tracking-wide"
  //       >
  //         Email <span className="text-red-400">*</span>
  //       </label>
  //       <InputForm
  //         id="email"
  //         name="email"
  //         type="email"
  //         autoComplete="email"
  //         placeholder="you@company.com"
  //       />
  //     </div>

  //     <div className="space-y-1.5">
  //       <label
  //         htmlFor="password"
  //         className="block text-[12px] font-medium text-[#3a3a3a] tracking-wide"
  //       >
  //         Password <span className="text-red-400">*</span>
  //       </label>
  //       <InputForm
  //         id="password"
  //         name="password"
  //         type="password"
  //         autoComplete="current-password"
  //         placeholder="Enter your password"
  //       />
  //     </div>

  //     <div className="flex items-center justify-between pt-1">
  //       <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 select-none">
  //         <input
  //           type="checkbox"
  //           defaultChecked
  //           className="w-4 h-4 accent-[#1b4f32] cursor-pointer rounded"
  //         />
  //         Remember me
  //       </label>
  //       <Link
  //         href="/reset-password"
  //         className="text-[13px] text-[#2d7a50] font-medium hover:text-[#1b4f32] transition-colors"
  //       >
  //         Forgot password?
  //       </Link>
  //     </div>

  //     <button
  //       type="submit"
  //       className="w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[14px] bg-[#1b4f32] hover:bg-[#225e3c] active:bg-[#163d28] transition-colors tracking-wide shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4f32] focus-visible:ring-offset-2"
  //     >
  //       Log in
  //     </button>

  //     <div className="flex items-center gap-3 py-2">
  //       <div className="flex-1 h-px bg-gray-200" />
  //       <span className="text-[10.5px] text-gray-400 tracking-[0.18em] uppercase font-medium">
  //         Or continue with
  //       </span>
  //       <div className="flex-1 h-px bg-gray-200" />
  //     </div>

  //     <SocialButtons />
  //   </form>

  //   <p className="text-center text-[13px] text-gray-500 mt-8">
  //     Don&apos;t have an account?{" "}
  //     <Link
  //       href="/signup"
  //       className="text-[#1b4f32] font-semibold hover:text-[#225e3c] transition-colors"
  //     >
  //       Register here
  //     </Link>
  //   </p>
  // </div>
}
