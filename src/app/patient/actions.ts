"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requirePatient() {
  const session = await auth();
  if (!session?.user || session.user.role !== "PATIENT") {
    throw new Error("Nicht autorisiert");
  }
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) throw new Error("Kein Patientenprofil gefunden");
  return patient;
}

export async function toggleTodo(todoId: string, done: boolean) {
  const patient = await requirePatient();
  await prisma.patientTodo.updateMany({
    where: { id: todoId, patientId: patient.id },
    data: { done },
  });
  revalidatePath("/patient");
}

export async function setMedicineDose(medicationId: string, anzahl: number) {
  const patient = await requirePatient();
  const med = await prisma.patientMedication.findFirst({
    where: { id: medicationId, patientId: patient.id },
  });
  if (!med) return;
  const capped = Math.max(0, Math.min(anzahl, med.einnahmenProTag));
  await prisma.patientMedication.update({
    where: { id: medicationId },
    data: { eingenommenAnzahl: capped },
  });
  revalidatePath("/patient/genesungsplan");
}

export async function cancelTermin(terminId: string) {
  const patient = await requirePatient();
  await prisma.termin.deleteMany({ where: { id: terminId, patientId: patient.id } });
  revalidatePath("/patient/termine");
}

export async function rescheduleTermin(terminId: string, newDatum: string) {
  const patient = await requirePatient();
  await prisma.termin.updateMany({
    where: { id: terminId, patientId: patient.id },
    data: { datum: new Date(newDatum) },
  });
  revalidatePath("/patient/termine");
}

export async function toggleExercise(exerciseId: string, done: boolean) {
  const patient = await requirePatient();
  await prisma.patientExercise.updateMany({
    where: { id: exerciseId, patientId: patient.id },
    data: { status: done ? "ERLEDIGT" : "OFFEN", erledigtAm: done ? new Date() : null },
  });
  revalidatePath("/patient/genesungsplan");
}

// Microflow 1: intelligenter Speichern-Button - berechnet PrioFlag und speichert das Check-in
export async function submitCheckIn(formData: FormData) {
  const patient = await requirePatient();

  const schmerzlevel = Number(formData.get("schmerzlevel"));
  const fieber = formData.get("fieber") === "on";
  const medsGenommen = formData.get("medsGenommen") === "on";
  const fotoDataUrl = formData.get("fotoDataUrl") as string | null;

  const prioFlag = fieber || schmerzlevel > 5 ? "HOCH" : "NORMAL";

  const checkIn = await prisma.checkIn.create({
    data: {
      patientId: patient.id,
      schmerzlevel,
      fieber,
      medsGenommen,
      prioFlag,
      arztStatus: "UNGELESEN",
    },
  });

  if (fotoDataUrl) {
    await prisma.wundFoto.create({
      data: { checkInId: checkIn.id, dataUrl: fotoDataUrl },
    });
  }

  if (patient.checkinAngefordert) {
    await prisma.patient.update({ where: { id: patient.id }, data: { checkinAngefordert: false } });
  }

  revalidatePath("/patient");
  return { success: true };
}
