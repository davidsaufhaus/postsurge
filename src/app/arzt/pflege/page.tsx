import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
  IN_VORBEREITUNG: "bg-[#86868b]/10 text-[#86868b]",
  BEREIT: "bg-[#ff9500]/10 text-[#ff9500]",
  ENTLASSEN: "bg-[#34c759]/10 text-[#34c759]",
};
const STATUS_LABEL: Record<string, string> = {
  IN_VORBEREITUNG: "In Vorbereitung",
  BEREIT: "Bereit",
  ENTLASSEN: "Entlassen",
};

export default async function PflegeUebersichtPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { name: "asc" },
    include: {
      checkIns: { orderBy: { datum: "desc" }, take: 1 },
    },
  });

  const offeneAnfragen = await prisma.checkIn.groupBy({
    by: ["patientId", "arztStatus"],
    where: { arztStatus: { in: ["RUECKRUF_ANGEFORDERT", "EINBESTELLEN"] } },
    _count: true,
  });

  function anfrageFor(patientId: string) {
    const treffer = offeneAnfragen.filter((a) => a.patientId === patientId);
    if (treffer.some((a) => a.arztStatus === "EINBESTELLEN")) return "EINBESTELLEN";
    if (treffer.some((a) => a.arztStatus === "RUECKRUF_ANGEFORDERT")) return "RUECKRUF_ANGEFORDERT";
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Pflege-Dashboard</h1>
      <p className="text-sm text-[#86868b]">
        Übersicht aller betreuten Patientinnen und Patienten mit aktuellem Status.
      </p>
      <div className="flex flex-col gap-3">
        {patients.map((p) => {
          const latest = p.checkIns[0];
          const anfrage = anfrageFor(p.id);
          return (
            <Link
              key={p.id}
              href={`/arzt/pflege/${p.id}`}
              className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-medium text-[#1d1d1f]">{p.name}</p>
                <p className="text-sm text-[#86868b]">
                  {p.opArt} &middot;{" "}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[p.entlassungsstatus] ?? "bg-[#86868b]/10 text-[#86868b]"}`}>
                    {STATUS_LABEL[p.entlassungsstatus] ?? p.entlassungsstatus}
                  </span>
                </p>
                {anfrage && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      anfrage === "EINBESTELLEN"
                        ? "bg-[#ff3b30]/10 text-[#ff3b30]"
                        : "bg-[#ff9500]/10 text-[#ff9500]"
                    }`}
                  >
                    {anfrage === "EINBESTELLEN" ? "Patient einbestellen" : "Rückruf anfordern"}
                  </span>
                )}
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
