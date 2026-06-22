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

export async function createMedication(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const wirkstoff = (formData.get("wirkstoff") as string)?.trim();
  const strength = (formData.get("strength") as string)?.trim();
  const form = (formData.get("form") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();

  if (!name || !wirkstoff || !strength || !form || !code) {
    return "Bitte alle Pflichtfelder ausfüllen.";
  }

  const existing = await prisma.medication.findUnique({ where: { code } });
  if (existing) {
    return "Ein Medikament mit diesem Code existiert bereits.";
  }

  await prisma.medication.create({ data: { name, wirkstoff, strength, form, code } });
  revalidatePath("/admin/medications");
  return "ok";
}

export async function toggleMedicationActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.medication.update({ where: { id }, data: { active } });
  revalidatePath("/admin/medications");
}

export async function deleteMedication(id: string) {
  await requireAdmin();
  await prisma.patientMedication.deleteMany({ where: { medicationId: id } });
  await prisma.medication.delete({ where: { id } });
  revalidatePath("/admin/medications");
}
