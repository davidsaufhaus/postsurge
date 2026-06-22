import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toggleExercise } from "../actions";

export default async function GenesungsplanPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { exercises: true },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const completed = patient.exercises.filter((e) => e.status === "ERLEDIGT").length;
  const total = patient.exercises.length;

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
    </div>
  );
}
