"use client";

import { useRef, useState, useTransition } from "react";
import { addPatientExercise } from "../actions";

const inputClass =
  "rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30";

export function ExerciseAddForm({ patientId }: { patientId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await addPatientExercise(patientId, formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setError(null);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-wrap items-end gap-2 rounded-xl bg-[#f5f5f7] p-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Name der Übung</label>
        <input name="name" required placeholder="z.B. Treppensteigen" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Anweisung</label>
        <input name="anweisung" required placeholder="Kurze Beschreibung" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Wiederholungen</label>
        <input name="wiederholungen" placeholder="z.B. 10x" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Frequenz</label>
        <input name="frequenz" placeholder="z.B. täglich" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Speichert…" : "Übung hinzufügen"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
