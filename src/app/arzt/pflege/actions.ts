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

// Medikation einstellen/anpassen darf nur der Arzt, nicht die Pflege
async function requireDoctor() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCTOR") {
    throw new Error("Nicht autorisiert: Nur Ärzte dürfen die Medikation einstellen.");
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

// Arzt markiert eine Pflege-Meldung im Dashboard als gelesen/bearbeitet
export async function markMeldungGelesen(meldungId: string) {
  await requireDoctor();
  const meldung = await prisma.pflegeMeldung.update({
    where: { id: meldungId },
    data: { gelesen: true },
  });
  revalidatePath("/arzt");
  revalidatePath(`/arzt/pflege/${meldung.patientId}`);
}

// Arzt weist dem Patienten ein neues Medikament aus dem Katalog zu
export async function addPatientMedication(patientId: string, formData: FormData) {
  await requireDoctor();

  const medicationId = formData.get("medicationId") as string;
  const dosage = (formData.get("dosage") as string)?.trim();
  const frequency = (formData.get("frequency") as string)?.trim();
  const einnahmezeit = (formData.get("einnahmezeit") as string)?.trim() ?? "";
  const hinweis = (formData.get("hinweis") as string)?.trim();

  if (!medicationId || !dosage || !frequency) {
    return { error: "Medikament, Dosierung und Häufigkeit sind erforderlich." };
  }

  await prisma.patientMedication.create({
    data: { patientId, medicationId, dosage, frequency, einnahmezeit, hinweis: hinweis || null },
  });

  revalidatePath(`/arzt/pflege/${patientId}`);
  revalidatePath("/patient/medikation");
  return { success: true };
}

// Arzt entfernt ein zugewiesenes Medikament wieder
export async function removePatientMedication(patientId: string, patientMedicationId: string) {
  await requireDoctor();
  await prisma.patientMedication.delete({ where: { id: patientMedicationId } });
  revalidatePath(`/arzt/pflege/${patientId}`);
  revalidatePath("/patient/medikation");
}

// Arzt ergänzt eine individuelle Übung zusätzlich zum Genesungsplan
export async function addPatientExercise(patientId: string, formData: FormData) {
  await requireDoctor();

  const name = (formData.get("name") as string)?.trim();
  const anweisung = (formData.get("anweisung") as string)?.trim();
  const wiederholungen = (formData.get("wiederholungen") as string)?.trim();
  const frequenz = (formData.get("frequenz") as string)?.trim();

  if (!name || !anweisung) {
    return { error: "Name und Anweisung sind erforderlich." };
  }

  await prisma.patientExercise.create({
    data: { patientId, name, anweisung, wiederholungen: wiederholungen || "", frequenz: frequenz || "" },
  });

  revalidatePath(`/arzt/pflege/${patientId}`);
  revalidatePath("/patient/genesungsplan");
  return { success: true };
}

// Arzt fordert vom Patienten ein zusätzliches Check-in zur Nachsorge an
export async function requestCheckin(patientId: string) {
  await requireDoctor();
  await prisma.patient.update({ where: { id: patientId }, data: { checkinAngefordert: true } });
  revalidatePath(`/arzt/pflege/${patientId}`);
  revalidatePath("/patient");
}

const DOCUMENT_CATEGORIES = [
  "ENTLASSUNGSBRIEF",
  "BEFUND",
  "AU_BESCHEINIGUNG",
  "UEBERWEISUNG",
  "AUFKLAERUNG",
  "REZEPT",
  "SONSTIGES",
];

// Hochladen eines Dokuments für den Patienten durch Arzt/Pflege
export async function uploadDocument(patientId: string, formData: FormData) {
  await requireArzt();

  const title = (formData.get("title") as string)?.trim();
  const category = formData.get("category") as string;
  const dataUrl = formData.get("dataUrl") as string | null;

  if (!title || !dataUrl) return { error: "Titel und Datei sind erforderlich." };
  if (!DOCUMENT_CATEGORIES.includes(category)) return { error: "Ungültige Kategorie." };

  await prisma.document.create({
    data: { patientId, title, category, dataUrl },
  });

  revalidatePath(`/arzt/pflege/${patientId}`);
  revalidatePath("/patient/dokumente");
  return { success: true };
}
