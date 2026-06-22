"use client";

import { useTransition } from "react";
import { markGesehen, requestRueckruf, requestEinbestellen } from "./actions";

export function DashboardActions({ checkInId }: { checkInId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => markGesehen(checkInId))}
        className="rounded-full bg-[#34c759] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2aa84a] disabled:opacity-60"
      >
        Gesehen &amp; Unauffällig
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => requestRueckruf(checkInId))}
        className="rounded-full bg-[#ff9500] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#e08600] disabled:opacity-60"
      >
        Pflege-Rückruf anfordern
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => requestEinbestellen(checkInId))}
        className="rounded-full bg-[#ff3b30] px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#d92e23] disabled:opacity-60"
      >
        Patient einbestellen
      </button>
    </div>
  );
}
