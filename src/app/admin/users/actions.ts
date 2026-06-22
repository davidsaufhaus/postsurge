"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Nicht autorisiert");
  }
}

// FA-1.1 / FA-1.2: Accounts für Personal und Patienten anlegen, Rolle zuweisen
export async function createUser(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const role = formData.get("role") as string;
  const password = (formData.get("password") as string) || "demo1234";

  if (!name || !email || !role) {
    return "Bitte alle Pflichtfelder ausfüllen.";
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return "Ein Nutzer mit dieser E-Mail existiert bereits.";
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (role === "PATIENT") {
    const opArt = (formData.get("opArt") as string)?.trim() || "Unbekannt";
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        patient: {
          create: {
            name,
            opDatum: new Date(),
            opArt,
          },
        },
      },
    });
  } else if (role === "DOCTOR" || role === "NURSE") {
    const fachabteilung = (formData.get("fachabteilung") as string)?.trim() || "Allgemein";
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        arzt: { create: { name, fachabteilung } },
      },
    });
  } else {
    await prisma.user.create({ data: { name, email, passwordHash, role } });
  }

  revalidatePath("/admin/users");
  return "ok";
}

// FA-1.3: kein Löschen für Nutzer mit aktiven Patientendaten - nur Deaktivieren
export async function toggleUserActive(userId: string, active: boolean) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { active } });
  revalidatePath("/admin/users");
}

export async function changeUserRole(userId: string, role: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

// US-Admin-G01: Passwort-Reset anstoßen
export async function resetPassword(userId: string) {
  await requireAdmin();
  const tempPassword = "demo1234";
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  revalidatePath("/admin/users");
  return tempPassword;
}
