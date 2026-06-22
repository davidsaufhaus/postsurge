import { prisma } from "@/lib/prisma";
import { MedicationForm } from "./medication-form";
import { MedicationRow } from "./medication-row";

export default async function MedicationsPage() {
  const medications = await prisma.medication.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Medikamentenkatalog</h1>
      <MedicationForm />
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f5f5f7] text-xs uppercase tracking-wide text-[#86868b]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Wirkstoff</th>
              <th className="px-4 py-3">Stärke</th>
              <th className="px-4 py-3">Form</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((m) => (
              <MedicationRow key={m.id} medication={m} />
            ))}
          </tbody>
        </table>
        {medications.length === 0 && (
          <p className="p-6 text-center text-sm text-[#86868b]">Noch keine Medikamente angelegt.</p>
        )}
      </div>
    </div>
  );
}
