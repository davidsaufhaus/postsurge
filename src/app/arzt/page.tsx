import { prisma } from "@/lib/prisma";
import { DashboardActions } from "./dashboard-actions";

export default async function ArztDashboardPage() {
  const checkIns = await prisma.checkIn.findMany({
    where: { arztStatus: "UNGELESEN" },
    include: { patient: true, wundFoto: true },
  });

  // Intelligente Sortierung: PrioFlag HOCH zuerst, dann älteste Einträge oben
  const sorted = [...checkIns].sort((a, b) => {
    if (a.prioFlag !== b.prioFlag) return a.prioFlag === "HOCH" ? -1 : 1;
    return new Date(a.datum).getTime() - new Date(b.datum).getTime();
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-5 text-xl font-semibold tracking-tight text-[#1d1d1f]">
        Posteingang &middot; Heutige Check-ins
      </h1>
      {sorted.length === 0 && (
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-[#86868b] shadow-sm">
          Inbox Zero &mdash; keine offenen Check-ins. 🎉
        </p>
      )}
      <div className="flex flex-col gap-3">
        {sorted.map((c) => (
          <div
            key={c.id}
            className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm ${
              c.prioFlag === "HOCH" ? "border-[#ff3b30]/20 bg-[#ff3b30]/5" : "border-black/5 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              {c.prioFlag === "HOCH" && <span className="text-xl text-[#ff3b30]">⚠️</span>}
              <div>
                <p className="font-medium text-[#1d1d1f]">{c.patient.name}</p>
                <p className="text-sm text-[#86868b]">
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
      </div>
    </div>
  );
}
