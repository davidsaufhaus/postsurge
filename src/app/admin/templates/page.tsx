import { prisma } from "@/lib/prisma";
import { TemplateForm } from "./template-form";
import { TemplateCard } from "./template-card";

export default async function TemplatesPage() {
  const templates = await prisma.recoveryPlanTemplate.findMany({
    include: { exercises: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
        Genesungsplan- &amp; Übungsplan-Vorlagen
      </h1>
      <TemplateForm />
      {templates.length === 0 && (
        <p className="rounded-2xl border border-black/5 bg-white p-8 text-center text-[#86868b] shadow-sm">
          Noch keine Vorlagen angelegt.
        </p>
      )}
      <div className="flex flex-col gap-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}
