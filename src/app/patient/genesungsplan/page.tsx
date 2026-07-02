import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toggleExercise, toggleMedication } from "../actions";

export default async function GenesungsplanPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { exercises: true, medications: { include: { medication: true } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const completed = patient.exercises.filter((e) => e.status === "ERLEDIGT").length;
  const total = patient.exercises.length;
  const medsCompleted = patient.medications.filter((m) => m.eingenommen).length;
  const medsTotal = patient.medications.length;

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold tracking-tight text-[#1d1d1f]">Dein Genesungsplan</h1>
        <p className="text-sm text-[#86868b]">
          {patient.postOpPfad ? `Pfad: ${patient.postOpPfad}` : "Noch kein Genesungsplan zugewiesen."}
        </p>
        {total > 0 && (
          <p className="mt-2 text-sm text-[#0071e3]">
            {completed} von {total} Übungen erledigt
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
          Übungen &amp; Bewegungsanweisungen
        </h2>
        {patient.exercises.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Übungen zugewiesen.</p>
        )}
        <ul className="flex flex-col gap-3">
          {patient.exercises.map((ex) => (
            <li key={ex.id} className="flex items-start gap-3 rounded-xl bg-[#f5f5f7] p-4">
              <form action={toggleExercise.bind(null, ex.id, ex.status !== "ERLEDIGT")} className="pt-0.5">
                <button
                  type="submit"
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    ex.status === "ERLEDIGT"
                      ? "border-[#34c759] bg-[#34c759] text-white"
                      : "border-black/15"
                  }`}
                >
                  {ex.status === "ERLEDIGT" && "✓"}
                </button>
              </form>
              <div>
                <p
                  className={`font-medium ${
                    ex.status === "ERLEDIGT" ? "text-[#86868b] line-through" : "text-[#1d1d1f]"
                  }`}
                >
                  {ex.name}
                </p>
                <p className="text-sm text-[#86868b]">{ex.anweisung}</p>
                <p className="text-xs text-[#86868b]">
                  {ex.wiederholungen} &middot; {ex.frequenz}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {medsTotal > 0 && (
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-[#1d1d1f]">Medikamente heute</h2>
          <p className="mb-4 text-sm text-[#0071e3]">
            {medsCompleted} von {medsTotal} eingenommen
          </p>
          <ul className="flex flex-col gap-3">
            {patient.medications.map((m) => (
              <li key={m.id} className="flex items-start gap-3 rounded-xl bg-[#f5f5f7] p-4">
                <form action={toggleMedication.bind(null, m.id, !m.eingenommen)} className="pt-0.5">
                  <button
                    type="submit"
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                      m.eingenommen
                        ? "border-[#34c759] bg-[#34c759] text-white"
                        : "border-black/15"
                    }`}
                  >
                    {m.eingenommen && "✓"}
                  </button>
                </form>
                <div>
                  <p className={`font-medium ${m.eingenommen ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}`}>
                    {m.medication.name} {m.medication.strength}
                  </p>
                  <p className="text-sm text-[#86868b]">
                    {m.dosage} &middot; {m.frequency}
                    {m.einnahmezeit ? ` · ${m.einnahmezeit}` : ""}
                  </p>
                  {m.hinweis && <p className="mt-0.5 text-xs text-[#ff9500]">{m.hinweis}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-[#0071e3]/10 bg-[#0071e3]/5 p-5 text-sm text-[#1d1d1f]">
        <p className="font-medium">Erinnerungen &ndash; in Planung</p>
        <p className="mt-1 text-[#86868b]">
          Automatische Erinnerungen für Übungen und Medikamente sind für eine zukünftige Version geplant.
          Bis dahin empfehlen wir, sich tägliche Wecker auf dem Smartphone einzurichten.
        </p>
      </section>
    </div>
  );
}
