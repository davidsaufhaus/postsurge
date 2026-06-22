"use client";

import { useTransition } from "react";
import { toggleMedicationActive, deleteMedication } from "./actions";
import type { Medication } from "@prisma/client";

export function MedicationRow({ medication }: { medication: Medication }) {
  const [pending, startTransition] = useTransition();

  return (
    <tr className="border-b border-black/5">
      <td className="px-4 py-3 font-medium text-[#1d1d1f]">{medication.name}</td>
      <td className="px-4 py-3 text-[#86868b]">{medication.wirkstoff}</td>
      <td className="px-4 py-3 text-[#86868b]">{medication.strength}</td>
      <td className="px-4 py-3 text-[#86868b]">{medication.form}</td>
      <td className="px-4 py-3 text-[#86868b]">{medication.code}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            medication.active ? "bg-[#34c759]/10 text-[#34c759]" : "bg-black/5 text-[#86868b]"
          }`}
        >
          {medication.active ? "Aktiv" : "Inaktiv"}
        </span>
      </td>
      <td className="flex gap-2 px-4 py-3">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(() => toggleMedicationActive(medication.id, !medication.active))
          }
          className="rounded-full border border-black/10 px-2.5 py-1 text-xs transition-colors hover:bg-black/5 disabled:opacity-60"
        >
          {medication.active ? "Deaktivieren" : "Aktivieren"}
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteMedication(medication.id))}
          className="rounded-full border border-[#ff3b30]/30 px-2.5 py-1 text-xs text-[#ff3b30] transition-colors hover:bg-[#ff3b30]/5 disabled:opacity-60"
        >
          Löschen
        </button>
      </td>
    </tr>
  );
}
