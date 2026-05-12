import { SignupForm } from "@/features/auth/components/SignupForm";

export default function page() {
  return <SignupForm />;

  // return (
  //   <>
  //     <div className="mb-8">
  //       <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
  //         Get started — it&apos;s free
  //       </p>
  //       <h1 className="text-[34px] font-bold text-[#111815] tracking-tight leading-tight mb-3">
  //         Create your account
  //       </h1>
  //       <p className="text-xs text-gray-400 font-light leading-relaxed">
  //         Join hundreds of organisations already using Gradlly to streamline
  //         apprenticeship management, track learner milestones, and keep
  //         compliance on track — from day one.
  //       </p>
  //     </div>

  //     <div className="space-y-4">
  //       <div>
  //         <label className="block text-xs font-medium text-[#444] mb-1.5 tracking-wide">
  //           Full Name <span className="text-red-400">*</span>
  //         </label>
  //         <InputForm
  //           name="name"
  //           placeholder="e.g. Adaeze Okonkwo"
  //           error={undefined}
  //         />
  //       </div>

  //       <div>
  //         <InputForm
  //           required
  //           label='Email'
  //           name="email"
  //           placeholder="you@yourorganisation.com"
  //           error={undefined}
  //         />
  //       </div>

  //       <div>
  //         <InputForm
  //           label="Password"
  //           required
  //           name="password"
  //           type="password"
  //           placeholder="Min. 8 characters"
  //           error={undefined}
  //         />
  //       </div>

  //       <label className="flex items-start gap-2.5 cursor-pointer pt-1">
  //         <RadioForm
  //           label="Password"
  //           required
  //           name="password"
  //           type="password"
  //           placeholder="Min. 8 characters"
  //           error={undefined}
  //         />

  //         <input
  //           type="checkbox"
  //           className="w-4 h-4  accent-[#1b4f32] flex-shrink-0 cursor-pointer"
  //         />
  //         <p className="text-xs text-gray-500 leading-relaxed flex flex-wrap items-center gap-1">
  //           <span>By creating an account you agree to our</span>

  //           <span className="text-[#2d7a50] font-medium cursor-pointer hover:underline">
  //             Terms of Service
  //           </span>
  //           <span>and</span>
  //           <span className="text-[#2d7a50] font-medium cursor-pointer hover:underline">
  //             Privacy Policy
  //           </span>
  //           <span>.</span>
  //         </p>
  //       </label>

  //       <button
  //         className="
  //           w-full py-3.5 rounded-xl font-semibold text-[#e8f5ec] text-[15px]
  //           bg-[#1b4f32] hover:bg-[#225e3c]
  //           transition-all tracking-wide
  //         "
  //       >
  //         Create Account
  //       </button>

  //       {/* <div className="flex items-center gap-3 py-1">
  //         <div className="flex-1 h-px bg-gray-200" />
  //         <span className="text-xs text-gray-400 tracking-wider">
  //           or continue with
  //         </span>
  //         <div className="flex-1 h-px bg-gray-200" />
  //       </div> */}

  //       <p className="text-center text-sm text-gray-500 pt-2 pb-4">
  //         Already have an account?{" "}
  //         <Link href="/login" className="text-[#1b4f32] font-semibold">
  //           Log in
  //         </Link>
  //       </p>
  //     </div>
  //   </>
  // );
}
