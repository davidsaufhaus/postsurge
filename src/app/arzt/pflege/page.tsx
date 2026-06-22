import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PflegeUebersichtPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { name: "asc" },
    include: {
      checkIns: { orderBy: { datum: "desc" }, take: 1 },
    },
  });

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Pflege-Dashboard</h1>
      <p className="text-sm text-[#86868b]">
        Übersicht aller betreuten Patientinnen und Patienten mit aktuellem Status.
      </p>
      <div className="flex flex-col gap-3">
        {patients.map((p) => {
          const latest = p.checkIns[0];
          return (
            <Link
              key={p.id}
              href={`/arzt/pflege/${p.id}`}
              className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-medium text-[#1d1d1f]">{p.name}</p>
                <p className="text-sm text-[#86868b]">
                  {p.opArt} &middot; Status: {p.entlassungsstatus}
                </p>
              </div>
              {latest && (
                <div className="text-right text-sm">
                  <p className={latest.prioFlag === "HOCH" ? "font-medium text-[#ff3b30]" : "text-[#86868b]"}>
                    Schmerz {latest.schmerzlevel}/10{latest.fieber ? " · Fieber" : ""}
                  </p>
                  <p className="text-xs text-[#86868b]">
                    {new Date(latest.datum).toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
