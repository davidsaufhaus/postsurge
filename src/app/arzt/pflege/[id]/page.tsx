import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MedicationChecklistItem } from "./medication-checklist";
import { ExerciseChecklistItem } from "./exercise-checklist";
import { MeldungForm } from "./meldung-form";

export default async function PflegePatientPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      checkIns: { orderBy: { datum: "desc" }, take: 7, include: { wundFoto: true } },
      medications: { include: { medication: true } },
      exercises: true,
      massnahmen: { orderBy: { durchgefuehrtAm: "desc" }, take: 10, include: { arzt: true } },
      meldungen: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!patient) notFound();

  const verlauf = [...patient.checkIns].reverse();
  const wundFotos = patient.checkIns.filter((c) => c.wundFoto).reverse();

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{patient.name}</h1>
        <p className="text-sm text-[#86868b]">
          {patient.opArt} &middot; Status: {patient.entlassungsstatus}
        </p>
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">
          Schmerz- &amp; Wohlbefindenverlauf (letzte 7 Tage)
        </h2>
        {verlauf.length === 0 && <p className="text-sm text-[#86868b]">Noch keine Check-ins.</p>}
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {verlauf.map((c) => (
            <div key={c.id} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md ${c.fieber ? "bg-[#ff3b30]" : "bg-[#0071e3]"}`}
                style={{ height: `${(c.schmerzlevel / 10) * 100}px` }}
                title={`Schmerzlevel ${c.schmerzlevel}/10`}
              />
              <span className="text-[10px] text-[#86868b]">
                {new Date(c.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">Medikationsplan</h2>
        <div className="flex flex-col gap-2">
          {patient.medications.map((m) => (
            <MedicationChecklistItem key={m.id} patientId={patient.id} med={m} />
          ))}
          {patient.medications.length === 0 && (
            <p className="text-sm text-[#86868b]">Keine Medikamente zugewiesen.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">
          Physiotherapeutische Übungen
        </h2>
        <div className="flex flex-col gap-2">
          {patient.exercises.map((ex) => (
            <ExerciseChecklistItem key={ex.id} patientId={patient.id} exercise={ex} />
          ))}
          {patient.exercises.length === 0 && (
            <p className="text-sm text-[#86868b]">Keine Übungen zugewiesen.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">Wundfoto-Chronik</h2>
        {wundFotos.length === 0 && <p className="text-sm text-[#86868b]">Keine Wundfotos vorhanden.</p>}
        <div className="flex gap-3 overflow-x-auto">
          {wundFotos.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={c.id}
              src={c.wundFoto!.dataUrl}
              alt={`Wundfoto vom ${new Date(c.datum).toLocaleDateString("de-DE")}`}
              title={new Date(c.datum).toLocaleDateString("de-DE")}
              className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">Meldung an das Ärzteteam</h2>
        <MeldungForm patientId={patient.id} />
        {patient.meldungen.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4">
            {patient.meldungen.map((m) => (
              <li key={m.id} className="text-sm text-[#86868b]">
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.dringlichkeit === 3
                      ? "bg-[#ff3b30]/10 text-[#ff3b30]"
                      : m.dringlichkeit === 2
                        ? "bg-[#ff9500]/10 text-[#ff9500]"
                        : "bg-[#0071e3]/10 text-[#0071e3]"
                  }`}
                >
                  Dringlichkeit {m.dringlichkeit}
                </span>
                {m.kommentar} &middot; {new Date(m.createdAt).toLocaleString("de-DE")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium tracking-tight text-[#1d1d1f]">
          Dokumentations-Protokoll (revisionssicher)
        </h2>
        {patient.massnahmen.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Maßnahmen dokumentiert.</p>
        )}
        <ul className="flex flex-col divide-y divide-black/5">
          {patient.massnahmen.map((m) => (
            <li key={m.id} className="py-2 text-sm text-[#86868b]">
              <span className="font-medium text-[#1d1d1f]">{m.arzt.name}</span> hat{" "}
              {m.typ === "MEDIKATION" ? "eine Medikamentengabe" : "eine Übung"} dokumentiert
              {m.kommentar ? ` – "${m.kommentar}"` : ""} &middot;{" "}
              {new Date(m.durchgefuehrtAm).toLocaleString("de-DE")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
