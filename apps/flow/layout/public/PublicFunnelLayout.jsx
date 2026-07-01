import Link from "next/link";

import { GradllyLogo } from "@/assets/svgs/GradllyLogo";

// Layout for the pre-account Levy funnel (eligibility check + registration
// wizard). No sidebar/session chrome — a lightweight branded shell an anonymous
// SME can use before an org exists.
export default function PublicFunnelLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f7f2] font-sans antialiased">
      <header className="sticky top-0 z-30 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            aria-label="Gradlly home"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2"
          >
            <GradllyLogo size={32} />
            <span className="text-sm font-semibold tracking-tight text-primary-700">
              Gradlly
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-700"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
