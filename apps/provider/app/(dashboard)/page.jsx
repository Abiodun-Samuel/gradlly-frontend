import { CURRENT_PORTAL } from "@/config/portals.config";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
/**
 * "/" — protected home.
 *
 * The (dashboard) layout has already validated the user via requireUser().
 * This page re-fetches with getCurrentUser() to render with the user inline.
 *
 * The dev panel below makes manual verification trivial:
 *   - Confirms WHICH portal you're on.
 *   - Confirms WHICH roles the upstream returned.
 *   - For each portal, shows access status + a one-click Open link, so
 *     stepping through the four portals proves the token and role-gating
 *     work end-to-end.
 */
export default async function HomePage() {
  return (
    <main className="min-h-screen p-8 bg-[#f7f9f8]">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50]">
          {CURRENT_PORTAL} portal
        </p>
        {/* <h1 className="text-3xl font-bold text-[#111815] mt-2">
          Welcome back{user.firstName ? `, ${user.firstName}` : ''}.
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          You are signed in as {user.email}.
        </p> */}
      </main>

      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div></div>
          <LogoutButton />
        </header>
      </div>
    </main>
  );
}
