"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireArzt() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "DOCTOR" && session.user.role !== "NURSE")) {
    throw new Error("Nicht autorisiert");
  }
  const arzt = await prisma.arzt.findUnique({ where: { userId: session.user.id } });
  if (!arzt) throw new Error("Kein Arztprofil gefunden");
  return arzt;
}

// Dokumentation einer Medikamentengabe durch die Pflege, revisionssicher mit Zeitstempel
export async function documentMedication(
  patientId: string,
  patientMedicationId: string,
  kommentar: string,
) {
  const arzt = await requireArzt();
  await prisma.pflegeMassnahme.create({
    data: {
      patientId,
      arztId: arzt.id,
      typ: "MEDIKATION",
      patientMedicationId,
      kommentar: kommentar || null,
    },
  });
  revalidatePath(`/arzt/pflege/${patientId}`);
}

// Dokumentation einer durchgeführten Übung durch die Pflege
export async function documentExercise(
  patientId: string,
  patientExerciseId: string,
  kommentar: string,
) {
  const arzt = await requireArzt();
  await prisma.pflegeMassnahme.create({
    data: {
      patientId,
      arztId: arzt.id,
      typ: "UEBUNG",
      patientExerciseId,
      kommentar: kommentar || null,
    },
  });
  await prisma.patientExercise.update({
    where: { id: patientExerciseId },
    data: { status: "ERLEDIGT", erledigtAm: new Date() },
  });
  revalidatePath(`/arzt/pflege/${patientId}`);
}

// Meldung von Auffälligkeiten an das Ärzteteam mit Dringlichkeitsstufe 1-3
export async function sendMeldung(patientId: string, dringlichkeit: number, kommentar: string) {
  const arzt = await requireArzt();
  if (!kommentar.trim()) return;
  await prisma.pflegeMeldung.create({
    data: { patientId, arztId: arzt.id, dringlichkeit, kommentar },
  });
  revalidatePath(`/arzt/pflege/${patientId}`);
}
