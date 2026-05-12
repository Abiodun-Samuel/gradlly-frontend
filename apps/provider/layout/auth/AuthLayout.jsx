import { Home } from "lucide-react";
import Link from "next/link";

import AuthLayoutSVG from "@/assets/svgs/AuthLayoutSVG";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f7f7f2] font-sans antialiased">
      {/* Decorative panel */}
      <aside className="hidden lg:flex relative overflow-hidden bg-[#0e2d1e] flex-col">
        <AuthLayoutSVG />

        <div className="relative z-10 mt-auto w-full px-12 xl:px-16 pb-14 xl:pb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7ecb9a] mb-4">
            Training Provider Platform
          </span>
          <h2
            className="text-[30px] xl:text-[38px] font-bold text-[#e8f5ec] leading-[1.1] tracking-tight mb-4"
            style={{ textShadow: "0 2px 24px rgba(7,24,16,0.55)" }}
          >
            Manage learners, programme delivery, and compliance operations in
            one place.
          </h2>
          <p className="text-[14px] xl:text-[15px] font-light leading-relaxed text-[#a8c9b5]">
            Support tutors, monitor quality, and stay inspection ready across
            every apprenticeship programme.
          </p>
        </div>
      </aside>

      {/* Form panel, centered on both axes */}
      <main className="relative flex items-center justify-center px-6 sm:px-10 py-20 sm:py-24 lg:py-16">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-10 lg:left-10 flex items-center gap-2.5 z-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4f32] focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="w-9 h-9 bg-[#1b4f32] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-colors group-hover:bg-[#225e3c]">
            <Home className="w-4 h-4 text-[#7ecb9a]" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-[#141f18] tracking-tight">
            Gradlly
          </span>
        </Link>

        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
