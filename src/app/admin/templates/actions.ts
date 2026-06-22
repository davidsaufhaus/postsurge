"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Nicht autorisiert");
  }
}

// FA-3.1: Genesungsplan-Vorlage pro OP-Art anlegen
export async function createTemplate(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const opArt = (formData.get("opArt") as string)?.trim();

  if (!name || !opArt) {
    return "Bitte alle Pflichtfelder ausfüllen.";
  }

  await prisma.recoveryPlanTemplate.create({ data: { name, opArt } });
  revalidatePath("/admin/templates");
  return "ok";
}

export async function deleteTemplate(id: string) {
  await requireAdmin();
  await prisma.exerciseTemplate.deleteMany({ where: { templateId: id } });
  await prisma.recoveryPlanTemplate.delete({ where: { id } });
  revalidatePath("/admin/templates");
}

// FA-3.2: Übungsplan-Vorlage mit Ausführungshinweisen, Wiederholungen und Frequenz
export async function addExercise(templateId: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const anweisung = (formData.get("anweisung") as string)?.trim();
  const wiederholungen = (formData.get("wiederholungen") as string)?.trim();
  const frequenz = (formData.get("frequenz") as string)?.trim();

  if (!name || !anweisung || !wiederholungen || !frequenz) return;

  await prisma.exerciseTemplate.create({
    data: { templateId, name, anweisung, wiederholungen, frequenz },
  });
  revalidatePath("/admin/templates");
}

export async function deleteExercise(id: string) {
  await requireAdmin();
  await prisma.exerciseTemplate.delete({ where: { id } });
  revalidatePath("/admin/templates");
}
