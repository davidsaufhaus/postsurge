import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddToCalendarButton } from "./add-to-calendar";

export default async function TerminePage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { termine: { orderBy: { datum: "asc" } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">Deine Nachsorgetermine</h1>
        {patient.termine.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Termine vereinbart.</p>
        )}
        <ul className="flex flex-col divide-y divide-black/5">
          {patient.termine.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-[#1d1d1f]">{t.titel}</p>
                <p className="text-sm text-[#86868b]">
                  {new Date(t.datum).toLocaleString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  &middot; {t.ort}
                </p>
              </div>
              <AddToCalendarButton titel={t.titel} datum={t.datum.toISOString()} ort={t.ort} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
