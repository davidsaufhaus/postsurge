"use client";

import { useRef, useTransition } from "react";
import { documentExercise } from "../actions";
import type { PatientExercise } from "@prisma/client";

export function ExerciseChecklistItem({
  patientId,
  exercise,
}: {
  patientId: string;
  exercise: PatientExercise;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const done = exercise.status === "ERLEDIGT";

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          await documentExercise(patientId, exercise.id, (fd.get("kommentar") as string) ?? "");
          formRef.current?.reset();
        })
      }
      className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f5f5f7] p-3"
    >
      <div className="flex-1">
        <p className={`text-sm font-medium ${done ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}`}>
          {exercise.name}
        </p>
        <p className="text-xs text-[#86868b]">
          {exercise.anweisung} &middot; {exercise.wiederholungen} &middot; {exercise.frequenz}
        </p>
      </div>
      {done ? (
        <span className="rounded-full bg-[#34c759]/10 px-2.5 py-1 text-xs font-medium text-[#34c759]">
          Erledigt
        </span>
      ) : (
        <>
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
            Als erledigt dokumentieren
          </button>
        </>
      )}
    </form>
  );
}
