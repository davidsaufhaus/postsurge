"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
    >
      Abmelden
    </button>
  );
}
