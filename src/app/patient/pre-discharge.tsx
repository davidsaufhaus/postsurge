import { toggleTodo } from "./actions";
import type { ClearanceCheck, PatientMedication, PatientTodo, Medication } from "@prisma/client";

type MedicationWithDetails = PatientMedication & { medication: Medication };

export function PreDischargeView({
  clearanceCheck,
  todos,
  medications,
}: {
  clearanceCheck: ClearanceCheck | null;
  todos: PatientTodo[];
  medications: MedicationWithDetails[];
}) {
  const steps = clearanceCheck
    ? [
        clearanceCheck.arztbriefFertig,
        clearanceCheck.abschlussuntersuchung,
        clearanceCheck.nachsorgePlanZugeordnet,
        clearanceCheck.freigabeErteilt,
      ]
    : [false, false, false, false];
  const completed = steps.filter(Boolean).length;
  const percent = Math.round((completed / steps.length) * 100);
  const isReady = clearanceCheck?.freigabeErteilt;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">Entlassungsstatus</h2>
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[#0071e3] transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-[#86868b]">
          Entlassung zu {percent}% vorbereitet
          {isReady ? " – Du bist bereit zur Entlassung!" : " – Warten auf Abschlussgespräch."}
        </p>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">Deine To-Dos</h2>
        <ul className="flex flex-col gap-3">
          {todos.length === 0 && <p className="text-sm text-[#86868b]">Keine offenen Aufgaben.</p>}
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3">
              <form action={toggleTodo.bind(null, todo.id, !todo.done)}>
                <button
                  type="submit"
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    todo.done ? "border-[#0071e3] bg-[#0071e3] text-white" : "border-black/15"
                  }`}
                >
                  {todo.done && "✓"}
                </button>
              </form>
              <span className={todo.done ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}>
                {todo.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
          Infocenter &middot; Deine Medikamente
        </h2>
        {medications.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Medikamente zugewiesen.</p>
        )}
        <ul className="flex flex-col divide-y divide-black/5">
          {medications.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-[#1d1d1f]">
                  {m.medication.name} {m.medication.strength}
                </p>
                <p className="text-sm text-[#86868b]">
                  {m.dosage} &middot; {m.frequency}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
