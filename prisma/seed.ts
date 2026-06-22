import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const arztUser = await prisma.user.create({
    data: {
      email: "arzt@postsurge.de",
      passwordHash,
      name: "Dr. Sarah Klein",
      role: "DOCTOR",
      arzt: {
        create: { name: "Dr. Sarah Klein", fachabteilung: "Orthopädie", telefonnummer: "+49 30 1234567" },
      },
    },
    include: { arzt: true },
  });

  const pflegeUser = await prisma.user.create({
    data: {
      email: "pflege@postsurge.de",
      passwordHash,
      name: "Tom Becker",
      role: "NURSE",
      arzt: { create: { name: "Tom Becker", fachabteilung: "Pflege", telefonnummer: "+49 30 1234599" } },
    },
    include: { arzt: true },
  });

  await prisma.user.create({
    data: {
      email: "admin@postsurge.de",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const medParacetamol = await prisma.medication.create({
    data: {
      name: "Paracetamol",
      wirkstoff: "Paracetamol",
      strength: "500mg",
      form: "Tablette",
      code: "MED-001",
      active: true,
    },
  });
  const medIbuprofen = await prisma.medication.create({
    data: {
      name: "Ibuprofen",
      wirkstoff: "Ibuprofen",
      strength: "400mg",
      form: "Tablette",
      code: "MED-002",
      active: true,
    },
  });

  const arztId = arztUser.arzt!.id;
  const pflegeId = pflegeUser.arzt!.id;

  // FA-3.1 / FA-3.2: Genesungsplan-Vorlage mit Übungen
  const knieTemplate = await prisma.recoveryPlanTemplate.create({
    data: {
      name: "Standard Knie-TEP",
      opArt: "Knie-Operation",
      exercises: {
        create: [
          {
            name: "Quadrizeps-Anspannung",
            anweisung: "Bein durchstrecken und 5 Sekunden halten",
            wiederholungen: "10x",
            frequenz: "3x täglich",
          },
          {
            name: "Fersenrutschen",
            anweisung: "Im Liegen die Ferse zum Gesäß ziehen",
            wiederholungen: "10x",
            frequenz: "2x täglich",
          },
        ],
      },
    },
  });

  const huefteTemplate = await prisma.recoveryPlanTemplate.create({
    data: {
      name: "Standard Hüft-TEP",
      opArt: "Hüft-Operation",
      exercises: {
        create: [
          {
            name: "Gehtraining mit Gehstützen",
            anweisung: "Kurze Strecken im 3-Punkt-Gang",
            wiederholungen: "3x 5 Minuten",
            frequenz: "täglich",
          },
          {
            name: "Hüftabduktion",
            anweisung: "Bein seitlich anheben, langsam absenken",
            wiederholungen: "10x",
            frequenz: "2x täglich",
          },
        ],
      },
    },
  });

  // Patient 1: vor der Entlassung, Clearance teilweise erledigt
  await prisma.user.create({
    data: {
      email: "patient@postsurge.de",
      passwordHash,
      name: "Maria Hoffmann",
      role: "PATIENT",
      patient: {
        create: {
          name: "Maria Hoffmann",
          opDatum: new Date("2026-06-15"),
          opArt: "Knie-Operation",
          entlassungsstatus: "IN_VORBEREITUNG",
          postOpPfad: knieTemplate.name,
          zusammenfassung:
            "Du wurdest am Knie operiert (Knie-Totalendoprothese). Der Eingriff verlief ohne Komplikationen. " +
            "In den nächsten Wochen ist es wichtig, die verordneten Übungen regelmäßig durchzuführen und die Wunde " +
            "sauber und trocken zu halten, bis die Fäden gezogen wurden.",
          betreuendArzt: { connect: { id: arztId } },
          clearanceCheck: {
            create: { arztbriefFertig: true, abschlussuntersuchung: true },
          },
          todos: {
            create: [
              { label: "Abholung durch Angehörige organisieren", done: false },
              { label: "Aufklärungsvideo zur Wundpflege ansehen", done: true },
              { label: "Auswahl des gewünschten Reha-Ortes", done: false },
            ],
          },
          medications: {
            create: [
              {
                medicationId: medParacetamol.id,
                dosage: "1 Tablette",
                frequency: "3x täglich",
                einnahmezeit: "morgens, mittags, abends",
                hinweis: "Nicht zusammen mit anderen paracetamolhaltigen Präparaten einnehmen.",
              },
            ],
          },
          termine: {
            create: [
              {
                titel: "Kontrolltermin Orthopädie",
                datum: new Date("2026-07-05T09:30:00"),
                ort: "Klinik am Park, Raum 204",
              },
              {
                titel: "Physiotherapie",
                datum: new Date("2026-06-29T14:00:00"),
                ort: "Praxis für Physiotherapie Müller",
              },
            ],
          },
          exercises: {
            create: [
              {
                name: "Quadrizeps-Anspannung",
                anweisung: "Bein durchstrecken und 5 Sekunden halten",
                wiederholungen: "10x",
                frequenz: "3x täglich",
              },
              {
                name: "Fersenrutschen",
                anweisung: "Im Liegen die Ferse zum Gesäß ziehen",
                wiederholungen: "10x",
                frequenz: "2x täglich",
              },
            ],
          },
          documents: {
            create: [
              { title: "Entlassungsbrief (Vorabversion)", category: "ENTLASSUNGSBRIEF" },
              { title: "Aufklärung Wundpflege", category: "AUFKLAERUNG" },
              {
                title: "Laborbefund präoperativ",
                category: "BEFUND",
                abteilung: "Zentrallabor",
              },
              {
                title: "Überweisung Physiotherapie",
                category: "UEBERWEISUNG",
                fachrichtung: "Physiotherapie",
                begruendung: "Postoperative Mobilisation nach Knie-TEP",
              },
            ],
          },
        },
      },
    },
  });

  // Patient 2: bereits entlassen, mit Check-in-Historie über 7 Tage
  const patient2 = await prisma.patient.create({
    data: {
      user: {
        create: {
          email: "patient2@postsurge.de",
          passwordHash,
          name: "Jonas Weber",
          role: "PATIENT",
        },
      },
      name: "Jonas Weber",
      opDatum: new Date("2026-06-10"),
      opArt: "Hüft-Operation",
      entlassungsstatus: "ENTLASSEN",
      naechsterTermin: new Date("2026-06-28"),
      zusammenfassung:
        "Du wurdest am Hüftgelenk operiert (Hüft-Totalendoprothese). Die Operation und der stationäre " +
        "Aufenthalt verliefen komplikationslos. Wichtig ist jetzt das schrittweise Gehtraining mit Gehstützen " +
        "sowie die Einnahme der verordneten Schmerzmedikation nach Bedarf.",
      betreuendArzt: { connect: { id: arztId } },
      postOpPfad: huefteTemplate.name,
      medications: {
        create: [
          {
            medicationId: medIbuprofen.id,
            dosage: "1 Tablette",
            frequency: "2x täglich",
            einnahmezeit: "morgens, abends",
            hinweis: "Mit ausreichend Wasser und möglichst zu einer Mahlzeit einnehmen.",
            geaendert: true,
          },
        ],
      },
      termine: {
        create: [
          {
            titel: "Kontrolltermin Orthopädie",
            datum: new Date("2026-06-28T11:00:00"),
            ort: "Klinik am Park, Raum 204",
          },
        ],
      },
      exercises: {
        create: [
          {
            name: "Gehtraining mit Gehstützen",
            anweisung: "Kurze Strecken im 3-Punkt-Gang",
            wiederholungen: "3x 5 Minuten",
            frequenz: "täglich",
            status: "ERLEDIGT",
            erledigtAm: new Date(),
          },
          {
            name: "Hüftabduktion",
            anweisung: "Bein seitlich anheben, langsam absenken",
            wiederholungen: "10x",
            frequenz: "2x täglich",
          },
        ],
      },
      documents: {
        create: [
          { title: "Entlassungsbrief", category: "ENTLASSUNGSBRIEF" },
          { title: "Rezept Ibuprofen 400mg", category: "REZEPT" },
          {
            title: "Arbeitsunfähigkeitsbescheinigung",
            category: "AU_BESCHEINIGUNG",
            gueltigVon: new Date("2026-06-10"),
            gueltigBis: new Date("2026-07-01"),
          },
          {
            title: "Röntgenbefund Hüfte postoperativ",
            category: "BEFUND",
            abteilung: "Radiologie",
          },
        ],
      },
    },
  });

  const checkInLevels = [3, 4, 6, 7, 5, 4, 2];
  for (let i = 0; i < checkInLevels.length; i++) {
    const daysAgo = checkInLevels.length - 1 - i;
    await prisma.checkIn.create({
      data: {
        patientId: patient2.id,
        schmerzlevel: checkInLevels[i],
        fieber: checkInLevels[i] >= 7,
        medsGenommen: true,
        prioFlag: checkInLevels[i] > 5 ? "HOCH" : "NORMAL",
        arztStatus: daysAgo === 0 ? "UNGELESEN" : "ERLEDIGT",
        datum: new Date(Date.now() - daysAgo * 1000 * 60 * 60 * 24),
      },
    });
  }

  // Pflege-Dokumentation und Meldung an das Ärzteteam
  const patientMed = await prisma.patientMedication.findFirstOrThrow({
    where: { patientId: patient2.id },
  });
  await prisma.pflegeMassnahme.create({
    data: {
      patientId: patient2.id,
      arztId: pflegeId,
      typ: "MEDIKATION",
      patientMedicationId: patientMed.id,
      kommentar: "Medikament wie verordnet verabreicht",
    },
  });

  await prisma.pflegeMeldung.create({
    data: {
      patientId: patient2.id,
      arztId: pflegeId,
      dringlichkeit: 2,
      kommentar: "Patient berichtet über leicht erhöhte Schmerzen beim Gehen, Wunde unauffällig.",
    },
  });

  console.log("Seed-Daten erfolgreich angelegt.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
