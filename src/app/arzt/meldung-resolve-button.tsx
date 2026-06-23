"use client";

import { useTransition } from "react";
import { markMeldungGelesen } from "./pflege/actions";

export function MeldungResolveButton({ meldungId }: { meldungId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => markMeldungGelesen(meldungId))}
      className="rounded-full bg-[#af52de]/10 px-3 py-1.5 text-xs font-medium text-[#af52de] transition-colors hover:bg-[#af52de]/20 disabled:opacity-60"
    >
      {pending ? "…" : "Als gelesen markieren"}
    </button>
  );
}
