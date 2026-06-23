import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MedicationChecklistItem } from "./medication-checklist";
import { ExerciseChecklistItem } from "./exercise-checklist";
import { MeldungForm } from "./meldung-form";
import { DocumentUploadForm } from "./document-upload-form";
import { MedicationManageForm } from "./medication-manage-form";
import { ExerciseAddForm } from "./exercise-add-form";
import { RequestCheckinButton } from "./request-checkin-button";
import { ResolveRequestButton } from "./resolve-request-button";

const DOCUMENT_CATEGORY_LABEL: Record<string, string> = {
  ENTLASSUNGSBRIEF: "Entlassbrief",
  BEFUND: "Befund",
  AU_BESCHEINIGUNG: "Arbeitsunfähigkeitsbescheinigung",
  UEBERWEISUNG: "Überweisung",
  AUFKLAERUNG: "Aufklärung",
  REZEPT: "Rezept",
  SONSTIGES: "Sonstiges",
};

export default async function PflegePatientPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();
  const isDoctor = session?.user?.role === "DOCTOR";

  const [patient, medicationCatalog, offeneAnfragen] = await Promise.all([
    prisma.patient.findUnique({
      where: { id },
      include: {
        checkIns: { orderBy: { datum: "desc" }, take: 7, include: { wundFoto: true } },
        medications: { include: { medication: true } },
        exercises: true,
        massnahmen: {
          orderBy: { durchgefuehrtAm: "desc" },
          take: 10,
          include: { arzt: true, patientMedication: { include: { medication: true } }, patientExercise: true },
        },
        meldungen: { orderBy: { createdAt: "desc" }, take: 5 },
        documents: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.medication.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.checkIn.findMany({
      where: { patientId: id, arztStatus: { in: ["RUECKRUF_ANGEFORDERT", "EINBESTELLEN"] } },
      orderBy: { datum: "desc" },
    }),
  ]);

  if (!patient) notFound();

  const verlauf = [...patient.checkIns].reverse();
  const wundFotos = patient.checkIns.filter((c) => c.wundFoto).reverse();

  return (
    <div className="mx-auto max-w-6xl flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{patient.name}</h1>
          <p className="text-sm text-[#86868b]">
            {patient.opArt} &middot; Status: {patient.entlassungsstatus}
          </p>
        </div>
        {isDoctor && (
          <RequestCheckinButton patientId={patient.id} alreadyRequested={patient.checkinAngefordert} />
        )}
      </div>

      {offeneAnfragen.length > 0 && (
        <section className="flex flex-col gap-2 rounded-2xl border border-[#ff9500]/20 bg-[#ff9500]/5 p-5">
          <h2 className="text-base font-medium tracking-tight text-[#1d1d1f]">Offene Anfragen vom Arzt</h2>
          {offeneAnfragen.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5">
              <p className="text-sm text-[#1d1d1f]">
                {c.arztStatus === "EINBESTELLEN" ? "Patient einbestellen" : "Pflege-Rückruf anfordern"}
                <span className="ml-2 text-xs text-[#86868b]">
                  {new Date(c.datum).toLocaleString("de-DE")}
                </span>
              </p>
              <ResolveRequestButton checkInId={c.id} />
            </div>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">
          Schmerz- &amp; Wohlbefindenverlauf (letzte 7 Tage)
        </h2>
        {verlauf.length === 0 && <p className="text-sm text-[#86868b]">Noch keine Check-ins.</p>}
        <div className="flex items-end gap-2" style={{ height: 90 }}>
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">Medikationsplan</h2>
          {isDoctor && (
            <div className="mb-4">
              <MedicationManageForm patientId={patient.id} catalog={medicationCatalog} assigned={patient.medications} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            {patient.medications.map((m) => (
              <MedicationChecklistItem key={m.id} patientId={patient.id} med={m} />
            ))}
            {patient.medications.length === 0 && (
              <p className="text-sm text-[#86868b]">Keine Medikamente zugewiesen.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">
            Physiotherapeutische Übungen
          </h2>
          {isDoctor && (
            <div className="mb-4">
              <ExerciseAddForm patientId={patient.id} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            {patient.exercises.map((ex) => (
              <ExerciseChecklistItem key={ex.id} patientId={patient.id} exercise={ex} />
            ))}
            {patient.exercises.length === 0 && (
              <p className="text-sm text-[#86868b]">Keine Übungen zugewiesen.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">Wundfoto-Chronik</h2>
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

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">Meldung an das Ärzteteam</h2>
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
                  {m.gelesen && <span className="ml-2 text-xs text-[#34c759]">✓ gelesen</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">Dokumente</h2>
          <DocumentUploadForm patientId={patient.id} />
          {patient.documents.length === 0 ? (
            <p className="mt-4 text-sm text-[#86868b]">Noch keine Dokumente hochgeladen.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {patient.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg bg-[#f5f5f7] px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1d1d1f]">{doc.title}</p>
                    <p className="text-xs text-[#86868b]">
                      {DOCUMENT_CATEGORY_LABEL[doc.category] ?? doc.category} &middot;{" "}
                      {new Date(doc.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  {doc.dataUrl && (
                    <a
                      href={doc.dataUrl}
                      download={doc.title}
                      className="rounded-full bg-[#0071e3]/10 px-3 py-1.5 text-xs font-medium text-[#0071e3] transition-colors hover:bg-[#0071e3]/20"
                    >
                      Herunterladen
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-medium tracking-tight text-[#1d1d1f]">
          Dokumentations-Protokoll (revisionssicher)
        </h2>
        {patient.massnahmen.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Maßnahmen dokumentiert.</p>
        )}
        <ul className="grid grid-cols-1 divide-y divide-black/5 lg:grid-cols-2 lg:gap-x-6 lg:divide-y-0">
          {patient.massnahmen.map((m) => {
            const detail =
              m.typ === "MEDIKATION"
                ? m.patientMedication
                  ? `${m.patientMedication.medication.name} ${m.patientMedication.medication.strength} (${m.patientMedication.dosage})`
                  : "ein Medikament"
                : m.patientExercise
                  ? m.patientExercise.name
                  : "eine Übung";
            return (
              <li key={m.id} className="py-2 text-sm text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">{m.arzt.name}</span> hat{" "}
                {m.typ === "MEDIKATION" ? (
                  <>
                    <span className="font-medium text-[#1d1d1f]">{detail}</span> verabreicht
                  </>
                ) : (
                  <>
                    die Übung <span className="font-medium text-[#1d1d1f]">{detail}</span> dokumentiert
                  </>
                )}
                {m.kommentar ? ` – "${m.kommentar}"` : ""} &middot;{" "}
                {new Date(m.durchgefuehrtAm).toLocaleString("de-DE")}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
