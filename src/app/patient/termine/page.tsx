import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TermineCalendar } from "./termine-calendar";

export default async function TerminePage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { termine: { orderBy: { datum: "asc" } } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const events = [
    ...(patient.naechsterTermin
      ? [
          {
            id: "naechster-kontrolltermin",
            titel: "Nächster Kontrolltermin",
            datum: patient.naechsterTermin.toISOString(),
            ort: "",
            typ: "kontrolle" as const,
          },
        ]
      : []),
    ...patient.termine.map((t) => ({
      id: t.id,
      titel: t.titel,
      datum: t.datum.toISOString(),
      ort: t.ort,
      typ: "termin" as const,
    })),
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">Deine Nachsorgetermine</h1>
        {events.length === 0 ? (
          <p className="text-sm text-[#86868b]">Noch keine Termine vereinbart.</p>
        ) : (
          <TermineCalendar events={events} />
        )}
      </section>
    </div>
  );
}
