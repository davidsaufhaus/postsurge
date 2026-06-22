import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MedikationPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { medications: { include: { medication: true } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">Dein Medikationsplan</h1>
        {patient.medications.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Medikamente zugewiesen.</p>
        )}
        <ul className="flex flex-col divide-y divide-black/5">
          {patient.medications.map((m) => (
            <li key={m.id} className="py-4">
              <div className="flex items-center gap-2">
                <p className="font-medium text-[#1d1d1f]">
                  {m.medication.name} {m.medication.strength}
                </p>
                {m.geaendert && (
                  <span className="rounded-full bg-[#ff9500]/10 px-2 py-0.5 text-xs font-medium text-[#ff9500]">
                    Geändert seit Klinikaufenthalt
                  </span>
                )}
              </div>
              <p className="text-sm text-[#86868b]">
                {m.dosage} &middot; {m.frequency}
                {m.einnahmezeit && ` · ${m.einnahmezeit}`}
              </p>
              {m.hinweis && (
                <p className="mt-1 rounded-lg bg-[#f5f5f7] p-2 text-xs text-[#1d1d1f]">
                  ℹ️ {m.hinweis}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
