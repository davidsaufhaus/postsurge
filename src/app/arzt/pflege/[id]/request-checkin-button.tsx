"use client";

import { useTransition } from "react";
import { requestCheckin } from "../actions";

export function RequestCheckinButton({
  patientId,
  alreadyRequested,
}: {
  patientId: string;
  alreadyRequested: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => requestCheckin(patientId))}
      disabled={pending || alreadyRequested}
      className="rounded-full bg-[#ff9500]/10 px-3 py-1.5 text-sm font-medium text-[#ff9500] transition-colors hover:bg-[#ff9500]/20 disabled:opacity-60"
    >
      {alreadyRequested
        ? "Check-in bereits angefordert"
        : pending
          ? "Wird angefordert…"
          : "Zusätzliches Check-in anfordern"}
    </button>
  );
}
