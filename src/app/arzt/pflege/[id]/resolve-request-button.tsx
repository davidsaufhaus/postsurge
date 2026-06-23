"use client";

import { useTransition } from "react";
import { resolveCheckInRequest } from "../../actions";

export function ResolveRequestButton({ checkInId }: { checkInId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => resolveCheckInRequest(checkInId))}
      className="rounded-full bg-[#34c759]/10 px-3 py-1.5 text-xs font-medium text-[#34c759] transition-colors hover:bg-[#34c759]/20 disabled:opacity-60"
    >
      {pending ? "…" : "Als erledigt markieren"}
    </button>
  );
}
