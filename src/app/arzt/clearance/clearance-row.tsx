"use client";

import { useTransition } from "react";
import { updateClearance, assignTemplate, entlassen } from "../actions";
import type { ClearanceCheck, RecoveryPlanTemplate } from "@prisma/client";

export function ClearanceRow({
  patientId,
  patientName,
  status,
  postOpPfad,
  clearanceCheck,
  templates,
}: {
  patientId: string;
  patientName: string;
  status: string;
  postOpPfad: string | null;
  clearanceCheck: ClearanceCheck | null;
  templates: RecoveryPlanTemplate[];
}) {
  const [pending, startTransition] = useTransition();

  function handleClearanceSubmit(formData: FormData) {
    startTransition(() => updateClearance(patientId, formData));
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium tracking-tight text-[#1d1d1f]">{patientName}</h3>
        <span className="rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-medium text-[#0071e3]">
          {status}
        </span>
      </div>

      <form action={handleClearanceSubmit} className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input type="checkbox" name="arztbriefFertig" defaultChecked={clearanceCheck?.arztbriefFertig} className="h-4 w-4 rounded" />
          Arztbrief abgeschlossen
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input
            type="checkbox"
            name="abschlussuntersuchung"
            defaultChecked={clearanceCheck?.abschlussuntersuchung}
            className="h-4 w-4 rounded"
          />
          Abschlussuntersuchung erfolgt
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input
            type="checkbox"
            name="nachsorgePlanZugeordnet"
            defaultChecked={clearanceCheck?.nachsorgePlanZugeordnet}
            className="h-4 w-4 rounded"
          />
          Nachsorgeplan zugeordnet
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input type="checkbox" name="freigabeErteilt" defaultChecked={clearanceCheck?.freigabeErteilt} className="h-4 w-4 rounded" />
          Freigabe erteilt
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-fit rounded-full bg-[#0071e3] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
        >
          Clearance speichern
        </button>
      </form>

      <div className="flex items-center gap-3">
        <label className="text-sm text-[#1d1d1f]">Genesungsplan-Vorlage:</label>
        <select
          defaultValue={templates.find((t) => t.name === postOpPfad)?.id ?? ""}
          onChange={(e) => startTransition(() => assignTemplate(patientId, e.target.value))}
          className="rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none focus:border-[#0071e3]"
        >
          <option value="">Bitte wählen…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.opArt})
            </option>
          ))}
        </select>
      </div>

      {status === "BEREIT" && (
        <form
          action={(fd) =>
            startTransition(() => entlassen(patientId, fd.get("naechsterTermin") as string))
          }
          className="flex items-center gap-3 border-t border-black/5 pt-4"
        >
          <label className="text-sm text-[#1d1d1f]">Nächster Kontrolltermin:</label>
          <input
            type="date"
            name="naechsterTermin"
            className="rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none focus:border-[#0071e3]"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[#34c759] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2aa84a] disabled:opacity-60"
          >
            Patient entlassen
          </button>
        </form>
      )}
    </div>
  );
}
