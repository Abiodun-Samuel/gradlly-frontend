import AuthLayoutSVG from "@/app/(auth)/svgs/AuthLayoutSVG";

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 font-sans overflow-hidden">
      <div className="hidden md:flex relative overflow-hidden bg-[#0e2d1e] flex-col justify-center p-12">
        <AuthLayoutSVG />

        <div className="relative z-10">
          <h2 className="text-[32px] font-bold text-[#e0f5e8] leading-tight tracking-tight mb-2">
            Manage your apprenticeships with ease.
          </h2>
          <p className="text-sm text-[rgba(200,235,210,0.55)] font-light leading-relaxed max-w-[280px]">
            Track progress, assign mentors, and keep everything organised — all
            in one place.
          </p>
        </div>
      </div>

      <div className="bg-[#f7f7f2] overflow-y-auto px-6 sm:px-10 md:px-14 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 bg-[#1b4f32] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14 7H10V16H8V7H4L9 2Z" fill="#7ecb9a" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#141f18] tracking-tight">
              Gradlly
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
