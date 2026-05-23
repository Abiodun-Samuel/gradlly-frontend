export function DashboardSkeleton() {
  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-50">
      <div className="hidden w-66 shrink-0 bg-primary-950 lg:flex lg:flex-col" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-16 shrink-0 border-b border-neutral-200 bg-white" />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-360 px-8 py-8">
            <div className="skeleton mb-8 h-14 w-full rounded-xl" />
            <div className="mb-8">
              <div className="skeleton mb-3 h-9 w-72 rounded-lg" />
              <div className="skeleton h-5 w-52 rounded-lg" />
            </div>
            <div className="mt-20 flex flex-col items-center gap-4">
              <div className="skeleton size-16 rounded-2xl" />
              <div className="skeleton h-6 w-52 rounded-lg" />
              <div className="skeleton h-4 w-80 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
