import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardActions } from "./dashboard-actions";
import { MeldungResolveButton } from "./meldung-resolve-button";

export default async function ArztDashboardPage() {
  const session = await auth();
  // Pflegepersonal hat keinen Zugriff auf das Arzt-Dashboard, nur auf das Pflege-Dashboard
  if (session?.user?.role === "NURSE") {
    redirect("/arzt/pflege");
  }

  const [checkIns, stationaerCount, meldungen] = await Promise.all([
    prisma.checkIn.findMany({
      where: { arztStatus: "UNGELESEN" },
      include: { patient: true, wundFoto: true },
    }),
    prisma.patient.count({ where: { entlassungsstatus: { not: "ENTLASSEN" } } }),
    prisma.pflegeMeldung.findMany({
      where: { gelesen: false },
      include: { patient: true, arzt: true },
      orderBy: [{ dringlichkeit: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  // Intelligente Sortierung: PrioFlag HOCH zuerst, dann älteste Einträge oben
  const sorted = [...checkIns].sort((a, b) => {
    if (a.prioFlag !== b.prioFlag) return a.prioFlag === "HOCH" ? -1 : 1;
    return new Date(a.datum).getTime() - new Date(b.datum).getTime();
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Posteingang</h1>
        <div className="rounded-2xl border border-black/5 bg-white px-4 py-2 text-right shadow-sm">
          <p className="text-2xl font-semibold tracking-tight text-[#0071e3]">{stationaerCount}</p>
          <p className="text-xs text-[#86868b]">Patienten stationär</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-[#86868b]">Heutige Check-ins</h2>
          {sorted.length === 0 && (
            <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-[#86868b] shadow-sm">
              Inbox Zero &mdash; keine offenen Check-ins. 🎉
            </p>
          )}
          {sorted.map((c) => (
            <div
              key={c.id}
              className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm ${
                c.prioFlag === "HOCH" ? "border-[#ff3b30]/20 bg-[#ff3b30]/5" : "border-black/5 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {c.prioFlag === "HOCH" && <span className="text-lg text-[#ff3b30]">⚠️</span>}
                <div>
                  <p className="font-medium text-[#1d1d1f]">{c.patient.name}</p>
                  <p className="text-xs text-[#86868b]">
                    {new Date(c.datum).toLocaleString("de-DE")} &middot; Schmerz {c.schmerzlevel}/10
                    {c.fieber ? " · Fieber: Ja" : " · Fieber: Nein"} &middot; Medikamente:{" "}
                    {c.medsGenommen ? "genommen" : "nicht genommen"}
                  </p>
                  {c.wundFoto && <p className="text-xs text-[#0071e3]">📷 Wundfoto vorhanden</p>}
                </div>
              </div>
              <DashboardActions checkInId={c.id} />
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-[#86868b]">Meldungen vom Pflegepersonal</h2>
          {meldungen.length === 0 && (
            <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-[#86868b] shadow-sm">
              Keine offenen Meldungen.
            </p>
          )}
          {meldungen.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#af52de]/20 bg-[#af52de]/5 p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🩺</span>
                <div>
                  <p className="font-medium text-[#1d1d1f]">
                    {m.patient.name}{" "}
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.dringlichkeit === 3
                          ? "bg-[#ff3b30]/10 text-[#ff3b30]"
                          : m.dringlichkeit === 2
                            ? "bg-[#ff9500]/10 text-[#ff9500]"
                            : "bg-[#af52de]/10 text-[#af52de]"
                      }`}
                    >
                      Dringlichkeit {m.dringlichkeit}
                    </span>
                  </p>
                  <p className="text-xs text-[#86868b]">
                    von {m.arzt.name} &middot; {new Date(m.createdAt).toLocaleString("de-DE")}
                  </p>
                  <p className="mt-1 text-sm text-[#1d1d1f]">{m.kommentar}</p>
                </div>
              </div>
              <MeldungResolveButton meldungId={m.id} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
