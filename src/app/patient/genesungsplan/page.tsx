import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toggleExercise, setMedicineDose } from "../actions";

export default async function GenesungsplanPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { exercises: true, medications: { include: { medication: true } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const completed = patient.exercises.filter((e) => e.status === "ERLEDIGT").length;
  const total = patient.exercises.length;

  const totalDoses = patient.medications.reduce((s, m) => s + m.einnahmenProTag, 0);
  const takenDoses = patient.medications.reduce((s, m) => s + m.eingenommenAnzahl, 0);

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
                <p className={`font-medium ${ex.status === "ERLEDIGT" ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}`}>
                  {ex.name}
                </p>
                <p className="text-sm text-[#86868b]">{ex.anweisung}</p>
                <p className="text-xs text-[#86868b]">{ex.wiederholungen} &middot; {ex.frequenz}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {patient.medications.length > 0 && (
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold tracking-tight text-[#1d1d1f]">Medikamente heute</h2>
          <p className="mb-4 text-sm text-[#0071e3]">
            {takenDoses} von {totalDoses} {totalDoses === 1 ? "Einnahme" : "Einnahmen"} erledigt
          </p>
          <ul className="flex flex-col gap-3">
            {patient.medications.map((m) => {
              const allTaken = m.eingenommenAnzahl >= m.einnahmenProTag;
              return (
                <li key={m.id} className="rounded-xl bg-[#f5f5f7] p-4">
                  <div className="flex items-start gap-3">
                    {/* N Dosis-Kreise */}
                    <div className="flex flex-shrink-0 gap-1.5 pt-0.5">
                      {Array.from({ length: m.einnahmenProTag }).map((_, i) => {
                        const isTaken = i < m.eingenommenAnzahl;
                        // Klick: wenn schon eingenommen → zurücksetzen auf i, sonst auf i+1
                        const nextAnzahl = isTaken ? i : i + 1;
                        return (
                          <form key={i} action={setMedicineDose.bind(null, m.id, nextAnzahl)}>
                            <button
                              type="submit"
                              title={isTaken ? `Einnahme ${i + 1} rückgängig` : `Einnahme ${i + 1} abhaken`}
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                                isTaken
                                  ? "border-[#34c759] bg-[#34c759] text-white"
                                  : "border-black/20 bg-white text-[#86868b] hover:border-[#34c759]/60"
                              }`}
                            >
                              {isTaken ? "✓" : i + 1}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${allTaken ? "text-[#86868b] line-through" : "text-[#1d1d1f]"}`}>
                        {m.medication.name} {m.medication.strength}
                      </p>
                      <p className="text-sm text-[#86868b]">
                        {m.dosage} &middot; {m.frequency}
                        {m.einnahmezeit ? ` · ${m.einnahmezeit}` : ""}
                      </p>
                      {m.hinweis && <p className="mt-0.5 text-xs text-[#ff9500]">{m.hinweis}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-[#0071e3]/10 bg-[#0071e3]/5 p-5 text-sm text-[#1d1d1f]">
        <p className="font-medium">Erinnerungen &ndash; in Planung</p>
        <p className="mt-1 text-[#86868b]">
          Automatische Erinnerungen für Übungen und Medikamente sind für eine zukünftige Version
          geplant. Bis dahin empfehlen wir, sich tägliche Wecker auf dem Smartphone einzurichten.
        </p>
      </section>
    </div>
  );
}
