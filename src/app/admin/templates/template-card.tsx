"use client";

import { useTransition, useRef } from "react";
import { addExercise, deleteExercise, deleteTemplate } from "./actions";
import type { ExerciseTemplate, RecoveryPlanTemplate } from "@prisma/client";

type TemplateWithExercises = RecoveryPlanTemplate & { exercises: ExerciseTemplate[] };

const inputClass =
  "rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-xs outline-none focus:border-[#0071e3]";

export function TemplateCard({ template }: { template: TemplateWithExercises }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleAddExercise(formData: FormData) {
    startTransition(async () => {
      await addExercise(template.id, formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-[#1d1d1f]">{template.name}</h3>
          <p className="text-xs text-[#86868b]">OP-Art: {template.opArt}</p>
        </div>
        <button
          disabled={pending}
          onClick={() => startTransition(() => deleteTemplate(template.id))}
          className="rounded-full border border-[#ff3b30]/30 px-2.5 py-1 text-xs text-[#ff3b30] transition-colors hover:bg-[#ff3b30]/5 disabled:opacity-60"
        >
          Vorlage löschen
        </button>
      </div>

      <ul className="flex flex-col divide-y divide-black/5">
        {template.exercises.map((ex) => (
          <li key={ex.id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className="font-medium text-[#1d1d1f]">{ex.name}</p>
              <p className="text-xs text-[#86868b]">
                {ex.anweisung} &middot; {ex.wiederholungen} &middot; {ex.frequenz}
              </p>
            </div>
            <button
              disabled={pending}
              onClick={() => startTransition(() => deleteExercise(ex.id))}
              className="text-xs text-[#ff3b30] hover:underline"
            >
              Entfernen
            </button>
          </li>
        ))}
        {template.exercises.length === 0 && (
          <li className="py-2 text-sm text-[#86868b]">Noch keine Übungen hinterlegt.</li>
        )}
      </ul>

      <form ref={formRef} action={handleAddExercise} className="flex flex-wrap items-end gap-2 border-t border-black/5 pt-4">
        <input name="name" required placeholder="Übung" className={inputClass} />
        <input name="anweisung" required placeholder="Ausführungshinweis" className={`${inputClass} w-48`} />
        <input name="wiederholungen" required placeholder="z.B. 10x" className={inputClass} />
        <input name="frequenz" required placeholder="z.B. 2x täglich" className={inputClass} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#1d1d1f] px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-60"
        >
          Übung hinzufügen
        </button>
      </form>
    </div>
  );
}
