"use client";

import { useRef, useTransition } from "react";
import { documentMedication } from "../actions";
import type { Medication, PatientMedication } from "@prisma/client";

type MedWithDetails = PatientMedication & { medication: Medication };

export function MedicationChecklistItem({
  patientId,
  med,
}: {
  patientId: string;
  med: MedWithDetails;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          await documentMedication(patientId, med.id, (fd.get("kommentar") as string) ?? "");
          formRef.current?.reset();
        })
      }
      className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f5f5f7] p-3"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1d1d1f]">
          {med.medication.name} {med.medication.strength}
        </p>
        <p className="text-xs text-[#86868b]">
          {med.dosage} &middot; {med.frequency}
        </p>
      </div>
      <input
        name="kommentar"
        placeholder="Kommentar (optional)"
        className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#0071e3]"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#34c759] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2aa84a] disabled:opacity-60"
      >
        Gabe dokumentieren
      </button>
    </form>
  );
}
