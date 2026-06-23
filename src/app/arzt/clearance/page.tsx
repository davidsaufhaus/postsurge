import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClearanceRow } from "./clearance-row";

export default async function ClearancePage() {
  const session = await auth();
  if (session?.user?.role !== "DOCTOR") {
    redirect("/arzt");
  }

  const [patients, templates] = await Promise.all([
    prisma.patient.findMany({
      where: { entlassungsstatus: { in: ["IN_VORBEREITUNG", "BEREIT"] } },
      include: { clearanceCheck: true },
      orderBy: { name: "asc" },
    }),
    prisma.recoveryPlanTemplate.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Entlassungs-Clearance</h1>
      {patients.length === 0 && (
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-[#86868b] shadow-sm">
          Alle Patienten sind entlassen.
        </p>
      )}
      {patients.map((p) => (
        <ClearanceRow
          key={p.id}
          patientId={p.id}
          patientName={p.name}
          status={p.entlassungsstatus}
          postOpPfad={p.postOpPfad}
          clearanceCheck={p.clearanceCheck}
          templates={templates}
        />
      ))}
    </div>
  );
}
