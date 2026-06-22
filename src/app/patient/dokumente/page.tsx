import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ShareButtons } from "./share-buttons";

const CATEGORY_LABEL: Record<string, string> = {
  ENTLASSUNGSBRIEF: "Entlassbrief",
  BEFUND: "Befund",
  AU_BESCHEINIGUNG: "Arbeitsunfähigkeitsbescheinigung",
  UEBERWEISUNG: "Überweisung",
  AUFKLAERUNG: "Aufklärung",
  REZEPT: "Rezept",
  SONSTIGES: "Sonstiges",
};

export default async function DokumentePage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const byCategory = patient.documents.reduce<Record<string, typeof patient.documents>>((acc, doc) => {
    (acc[doc.category] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
          Deine Entlassunterlagen
        </h1>
        {patient.documents.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Dokumente verfügbar.</p>
        )}

        {Object.entries(byCategory).map(([category, docs]) => (
          <div key={category} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-[#86868b]">
              {CATEGORY_LABEL[category] ?? category}
            </h2>
            <ul className="flex flex-col divide-y divide-black/5">
              {docs.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{doc.title}</p>
                    <p className="text-xs text-[#86868b]">
                      {new Date(doc.createdAt).toLocaleDateString("de-DE")}
                      {doc.abteilung && ` · ${doc.abteilung}`}
                      {doc.fachrichtung && ` · Fachrichtung: ${doc.fachrichtung}`}
                    </p>
                    {doc.begruendung && (
                      <p className="text-xs text-[#86868b]">Begründung: {doc.begruendung}</p>
                    )}
                    {doc.gueltigVon && doc.gueltigBis && (
                      <p className="text-xs text-[#86868b]">
                        Gültig: {new Date(doc.gueltigVon).toLocaleDateString("de-DE")} &ndash;{" "}
                        {new Date(doc.gueltigBis).toLocaleDateString("de-DE")}
                      </p>
                    )}
                  </div>
                  <span className="text-xl">📄</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <ShareButtons />
      </section>
    </div>
  );
}
