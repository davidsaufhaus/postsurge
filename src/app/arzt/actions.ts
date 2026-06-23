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
  return { arzt, userId: session.user.id };
}

// Entlassungsclearance darf ausschließlich vom Arzt durchgeführt werden, nicht von der Pflege
async function requireDoctor() {
  const session = await auth();
  if (!session?.user || session.user.role !== "DOCTOR") {
    throw new Error("Nicht autorisiert: Nur Ärzte dürfen die Entlassungsclearance bearbeiten.");
  }
  const arzt = await prisma.arzt.findUnique({ where: { userId: session.user.id } });
  if (!arzt) throw new Error("Kein Arztprofil gefunden");
  return { arzt, userId: session.user.id };
}

// Microflow 2: Arzt-Entscheidung - setzt Status, schreibt Audit-Log
async function decide(checkInId: string, arztStatus: string, action: string) {
  const { arzt, userId } = await requireArzt();

  await prisma.checkIn.update({
    where: { id: checkInId },
    data: {
      arztStatus,
      gesichtetVonId: arzt.id,
      gesichtetAm: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      checkInId,
      arztId: arzt.id,
      actorUserId: userId,
      action,
    },
  });

  revalidatePath("/arzt");
}

export async function markGesehen(checkInId: string) {
  await decide(checkInId, "ERLEDIGT", "Gesehen & Unauffällig");
}

export async function requestRueckruf(checkInId: string) {
  await decide(checkInId, "RUECKRUF_ANGEFORDERT", "Pflege-Rückruf angefordert");
  revalidatePath("/arzt/pflege");
}

export async function requestEinbestellen(checkInId: string) {
  await decide(checkInId, "EINBESTELLEN", "Patient einbestellt");
  revalidatePath("/arzt/pflege");
}

// Pflege markiert eine angeforderte Rückruf-/Einbestellungs-Aufgabe als erledigt
export async function resolveCheckInRequest(checkInId: string) {
  await decide(checkInId, "ERLEDIGT", "Pflege-Aufgabe erledigt");
  revalidatePath("/arzt/pflege");
}

export async function updateClearance(patientId: string, formData: FormData) {
  await requireDoctor();

  const arztbriefFertig = formData.get("arztbriefFertig") === "on";
  const abschlussuntersuchung = formData.get("abschlussuntersuchung") === "on";
  const nachsorgePlanZugeordnet = formData.get("nachsorgePlanZugeordnet") === "on";
  const freigabeErteilt = formData.get("freigabeErteilt") === "on";

  await prisma.clearanceCheck.upsert({
    where: { patientId },
    create: {
      patientId,
      arztbriefFertig,
      abschlussuntersuchung,
      nachsorgePlanZugeordnet,
      freigabeErteilt,
    },
    update: { arztbriefFertig, abschlussuntersuchung, nachsorgePlanZugeordnet, freigabeErteilt },
  });

  await prisma.patient.update({
    where: { id: patientId },
    data: {
      entlassungsstatus: freigabeErteilt ? "BEREIT" : "IN_VORBEREITUNG",
    },
  });

  revalidatePath("/arzt/clearance");
}

// FA-3.3: Zuweisung kopiert die Vorlage, damit individuelle Anpassungen die globale Vorlage nicht verändern
export async function assignTemplate(patientId: string, templateId: string) {
  await requireDoctor();

  if (!templateId) {
    await prisma.patient.update({ where: { id: patientId }, data: { postOpPfad: null } });
    revalidatePath("/arzt/clearance");
    return;
  }

  const template = await prisma.recoveryPlanTemplate.findUnique({
    where: { id: templateId },
    include: { exercises: true },
  });
  if (!template) return;

  await prisma.patientExercise.deleteMany({ where: { patientId, status: "OFFEN" } });

  await prisma.patient.update({ where: { id: patientId }, data: { postOpPfad: template.name } });

  await prisma.patientExercise.createMany({
    data: template.exercises.map((ex) => ({
      patientId,
      name: ex.name,
      anweisung: ex.anweisung,
      wiederholungen: ex.wiederholungen,
      frequenz: ex.frequenz,
    })),
  });

  revalidatePath("/arzt/clearance");
}

export async function entlassen(patientId: string, naechsterTermin: string) {
  await requireDoctor();
  await prisma.patient.update({
    where: { id: patientId },
    data: {
      entlassungsstatus: "ENTLASSEN",
      naechsterTermin: naechsterTermin ? new Date(naechsterTermin) : null,
    },
  });
  revalidatePath("/arzt/clearance");
}
