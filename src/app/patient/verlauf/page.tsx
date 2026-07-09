import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function VerlaufPage() {
  const session = await auth();
  const patient = await prisma.patient.findUnique({
    where: { userId: session!.user.id },
    include: { checkIns: { orderBy: { datum: "desc" }, take: 14 } },
  });

  if (!patient) return <p className="text-[#86868b]">Kein Patientenprofil gefunden.</p>;

  const checkIns = [...patient.checkIns].reverse();
  const maxLevel = 10;
  const CHART_H = 120; // px — Y-Achse und Balken nutzen exakt denselben Wert

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <section className="rounded-2xl border border-black/5 bg-[#ff3b30]/5 p-5 text-sm text-[#1d1d1f]">
        <p className="font-medium">Wann solltest du medizinische Hilfe kontaktieren?</p>
        <p className="mt-1 text-[#86868b]">
          Bei starken oder schnell zunehmenden Schmerzen, hohem Fieber, ungewöhnlicher Rötung oder
          Ausfluss an der Wunde oder bei Atemnot wende dich bitte umgehend an dein Behandlungsteam
          oder die Notaufnahme.
        </p>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h1 className="mb-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
          Letzte Check-ins &amp; Schmerzskala
        </h1>
        {checkIns.length === 0 && (
          <p className="text-sm text-[#86868b]">Noch keine Check-ins erfasst.</p>
        )}
        <div className="flex gap-2">
          {/* Y-Achse: exakt CHART_H hoch, 5 Linien für 10/8/6/4/2/0 */}
          <div className="relative flex-shrink-0 text-right" style={{ height: CHART_H, width: 20 }}>
            {[10, 8, 6, 4, 2, 0].map((v) => (
              <span
                key={v}
                className="absolute right-0 text-[10px] leading-none text-[#86868b]"
                style={{ bottom: (v / maxLevel) * CHART_H - 5 }}
              >
                {v}
              </span>
            ))}
          </div>
          {/* Balken-Container: exakt CHART_H hoch */}
          <div className="flex flex-1 items-end gap-1.5" style={{ height: CHART_H }}>
            {checkIns.map((c) => (
              <div key={c.id} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: CHART_H }}>
                <div
                  className={`w-full rounded-t-md ${c.fieber ? "bg-[#ff3b30]" : "bg-[#0071e3]"}`}
                  style={{ height: Math.max(2, (c.schmerzlevel / maxLevel) * CHART_H) }}
                  title={`Schmerzlevel ${c.schmerzlevel}/10`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* X-Achse Datumsbeschriftung */}
        <div className="mt-1 flex gap-1.5 pl-[28px]">
          {checkIns.map((c) => (
            <span key={c.id} className="flex-1 text-center text-[10px] text-[#86868b]">
              {new Date(c.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-[#86868b]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0071e3]" /> Schmerz</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#ff3b30]" /> mit Fieber</span>
          <span className="ml-auto">Achse: Schmerzlevel 0–10</span>
        </div>
        <ul className="mt-6 flex flex-col divide-y divide-black/5">
          {[...patient.checkIns].map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-[#86868b]">{new Date(c.datum).toLocaleString("de-DE")}</span>
              <span className="text-[#1d1d1f]">
                Schmerz {c.schmerzlevel}/10 &middot; Fieber: {c.fieber ? "Ja" : "Nein"} &middot;
                Medikamente: {c.medsGenommen ? "genommen" : "nicht genommen"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
