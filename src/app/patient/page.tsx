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
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {patient.zusammenfassung && (
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#1d1d1f]">
            Dein Aufenthalt im Überblick
          </h2>
          <p className="text-sm leading-relaxed text-[#1d1d1f]">{patient.zusammenfassung}</p>
        </section>
      )}

      {isDischarged ? (
        <CheckInForm
          naechsterTermin={
            patient.naechsterTermin
              ? new Date(patient.naechsterTermin).toLocaleDateString("de-DE")
              : null
          }
        />
      ) : (
        <PreDischargeView
          clearanceCheck={patient.clearanceCheck}
          todos={patient.todos}
          medications={patient.medications}
        />
      )}

      {patient.betreuendArzt && (
        <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
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
  );
}
