import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PreDischargeView } from "./pre-discharge";
import { CheckInForm } from "./checkin-form";

export default async function PatientPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: {
      clearanceCheck: true,
      todos: true,
      medications: { include: { medication: true } },
      betreuendArzt: true,
    },
  });

  if (!patient) {
    return <p className="text-slate-600">Kein Patientenprofil gefunden.</p>;
  }

  const isDischarged = patient.entlassungsstatus === "ENTLASSEN";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      {patient.checkinAngefordert && (
        <section className="rounded-2xl border border-[#ff9500]/20 bg-[#ff9500]/10 p-4 text-sm text-[#1d1d1f]">
          Dein Behandlungsteam bittet dich um ein zusätzliches Check-in zur Nachsorge.
        </section>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {patient.zusammenfassung && (
            <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">
                Dein Aufenthalt im Überblick
              </h2>
              <p className="text-sm leading-relaxed text-[#1d1d1f]">{patient.zusammenfassung}</p>
            </section>
          )}

          {!isDischarged && (
            <PreDischargeView
              clearanceCheck={patient.clearanceCheck}
              todos={patient.todos}
              medications={patient.medications}
            />
          )}

          <CheckInForm
            naechsterTermin={
              isDischarged && patient.naechsterTermin
                ? new Date(patient.naechsterTermin).toLocaleDateString("de-DE")
                : null
            }
          />
        </div>

        {patient.betreuendArzt && (
          <section className="self-start rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">
              Dein Ansprechpartner
            </h2>
            <p className="text-sm text-[#1d1d1f]">{patient.betreuendArzt.name}</p>
            <p className="text-sm text-[#86868b]">{patient.betreuendArzt.fachabteilung}</p>
            {patient.betreuendArzt.telefonnummer && (
              <p className="mt-1 text-sm text-[#0071e3]">📞 {patient.betreuendArzt.telefonnummer}</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
