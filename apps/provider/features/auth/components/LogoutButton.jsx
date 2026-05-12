"use client";

import { useLogout } from "../queries/auth.query";

export function LogoutButton() {
  const logout = useLogout();
  return (
    <button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="px-4 py-2 rounded-lg bg-[#1b4f32] text-white text-sm font-semibold disabled:opacity-60"
    >
      {logout.isPending ? "Logging out…" : "Log out"}
    </button>
  );
}
