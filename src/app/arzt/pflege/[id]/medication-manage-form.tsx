"use client";

import { useRef, useState, useTransition } from "react";
import { addPatientMedication, removePatientMedication, updateMedicationDoses } from "../actions";
import type { Medication, PatientMedication } from "@prisma/client";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30 sm:w-auto";

function DosesEditor({ med }: { med: PatientMedication & { medication: Medication } }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(med.einnahmenProTag);
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      await updateMedicationDoses(med.id, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-[#86868b]">×/Tag:</span>
      <input
        type="number"
        min={1}
        max={10}
        value={value}
        onChange={(e) => { setValue(Number(e.target.value)); setSaved(false); }}
        className="w-12 rounded border border-black/10 bg-[#f5f5f7] px-1.5 py-1 text-center text-sm outline-none focus:border-[#0071e3]"
      />
      {value !== med.einnahmenProTag || !saved ? (
        <button
          onClick={save}
          disabled={pending || value === med.einnahmenProTag}
          className="rounded-full bg-[#0071e3]/10 px-2 py-1 text-xs font-medium text-[#0071e3] hover:bg-[#0071e3]/20 disabled:opacity-40"
        >
          {pending ? "…" : saved ? "✓" : "Speichern"}
        </button>
      ) : (
        <span className="text-xs text-[#34c759]">✓</span>
      )}
    </div>
  );
}

export function MedicationManageForm({
  patientId,
  catalog,
  assigned,
}: {
  patientId: string;
  catalog: Medication[];
  assigned: (PatientMedication & { medication: Medication })[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await addPatientMedication(patientId, formData);
      if (res?.error) { setError(res.error); return; }
      setError(null);
      formRef.current?.reset();
      setOpen(false);
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => { await removePatientMedication(patientId, id); });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#f5f5f7] p-4">
      <p className="text-xs font-medium text-[#86868b]">Aktuell zugewiesen</p>
      {assigned.length === 0 && <p className="text-sm text-[#86868b]">Keine Medikamente zugewiesen.</p>}
      <ul className="flex flex-col gap-2">
        {assigned.map((m) => (
          <li key={m.id} className="flex flex-col gap-2 rounded-lg bg-white px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <span className="font-medium text-[#1d1d1f]">{m.medication.name} {m.medication.strength}</span>
              <span className="ml-1 text-[#86868b]">
                &middot; {m.dosage} &middot; {m.frequency}
                {m.einnahmezeit && ` · ${m.einnahmezeit}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DosesEditor med={m} />
              <button
                onClick={() => handleRemove(m.id)}
                disabled={pending}
                className="text-xs font-medium text-[#ff3b30] hover:underline disabled:opacity-60"
              >
                Entfernen
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 self-start rounded-full bg-[#0071e3]/10 px-3 py-1.5 text-sm font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/20"
        >
          <span className="text-base leading-none">+</span> Medikament hinzufügen
        </button>
      ) : (
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-[#0071e3]/20 bg-white p-4">
          <p className="text-xs font-semibold text-[#1d1d1f]">Neues Medikament zuweisen</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Medikament</label>
              <select name="medicationId" required defaultValue="" className={inputClass}>
                <option value="" disabled>Bitte wählen…</option>
                {catalog.map((med) => (
                  <option key={med.id} value={med.id}>{med.name} {med.strength}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Menge / Dosierung</label>
              <input name="dosage" required placeholder="z.B. 1 Tablette" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Häufigkeit</label>
              <input name="frequency" required placeholder="z.B. 3x täglich" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Einnahmen pro Tag</label>
              <input name="einnahmenProTag" type="number" min={1} max={10} defaultValue={1} className={inputClass} style={{ width: 70 }} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Einnahmezeit</label>
              <input name="einnahmezeit" placeholder="morgens/abends" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#86868b]">Hinweis</label>
              <input name="hinweis" placeholder="optional" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
            >
              {pending ? "Speichert…" : "Zuweisen"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-[#86868b] hover:underline">
              Abbrechen
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}
