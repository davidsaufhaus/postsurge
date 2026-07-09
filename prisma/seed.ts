import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Datenbank leeren (Reihenfolge nach Abhaengigkeiten)
  await prisma.auditLog.deleteMany();
  await prisma.wundFoto.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.pflegeMassnahme.deleteMany();
  await prisma.pflegeMeldung.deleteMany();
  await prisma.patientMedication.deleteMany();
  await prisma.patientExercise.deleteMany();
  await prisma.document.deleteMany();
  await prisma.termin.deleteMany();
  await prisma.patientTodo.deleteMany();
  await prisma.clearanceCheck.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.exerciseTemplate.deleteMany();
  await prisma.recoveryPlanTemplate.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.arzt.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("demo1234", 10);

  // ── Benutzer & Rollen ──────────────────────────────────────────────────────

  const arztUser = await prisma.user.create({
    data: {
      email: "arzt@postsurge.de",
      passwordHash: pw,
      name: "Dr. Sarah Klein",
      role: "DOCTOR",
      arzt: {
        create: {
          name: "Dr. Sarah Klein",
          fachabteilung: "Orthopaedie",
          telefonnummer: "+49 2331 987-0",
        },
      },
    },
    include: { arzt: true },
  });

  const pflegeUser = await prisma.user.create({
    data: {
      email: "pflege@postsurge.de",
      passwordHash: pw,
      name: "Tom Becker",
      role: "NURSE",
      arzt: {
        create: {
          name: "Tom Becker",
          fachabteilung: "Pflege",
          telefonnummer: "+49 2331 987-50",
        },
      },
    },
    include: { arzt: true },
  });

  await prisma.user.create({
    data: {
      email: "admin@postsurge.de",
      passwordHash: pw,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const arztId = arztUser.arzt!.id;
  const pflegeId = pflegeUser.arzt!.id;

  // ── Medikamentenkatalog ────────────────────────────────────────────────────

  const medParacetamol = await prisma.medication.create({
    data: { name: "Paracetamol", wirkstoff: "Paracetamol", strength: "500 mg", form: "Tablette", code: "MED-001", active: true },
  });
  const medIbuprofen = await prisma.medication.create({
    data: { name: "Ibuprofen", wirkstoff: "Ibuprofen", strength: "400 mg", form: "Tablette", code: "MED-002", active: true },
  });
  const medMetamizol = await prisma.medication.create({
    data: { name: "Metamizol", wirkstoff: "Metamizol-Natrium", strength: "500 mg", form: "Tablette", code: "MED-003", active: true },
  });
  const medPantoprazol = await prisma.medication.create({
    data: { name: "Pantoprazol", wirkstoff: "Pantoprazol", strength: "40 mg", form: "Tablette", code: "MED-004", active: true },
  });
  const medClexane = await prisma.medication.create({
    data: { name: "Clexane", wirkstoff: "Enoxaparin-Natrium", strength: "40 mg", form: "Fertigspritze", code: "MED-005", active: true },
  });
  const medBisoprolol = await prisma.medication.create({
    data: { name: "Bisoprolol", wirkstoff: "Bisoprolol-Fumarat", strength: "5 mg", form: "Tablette", code: "MED-006", active: true },
  });
  const medMetoprolol = await prisma.medication.create({
    data: { name: "Metoprolol", wirkstoff: "Metoprolol-Succinat", strength: "50 mg", form: "Tablette", code: "MED-007", active: true },
  });

  // ── Genesungsplan-Vorlagen ─────────────────────────────────────────────────

  await prisma.recoveryPlanTemplate.create({
    data: {
      name: "Standard Knie-TEP",
      opArt: "Knie-Operation",
      exercises: {
        create: [
          { name: "Quadrizeps-Anspannung", anweisung: "Bein durchstrecken, Oberschenkelmuskel anspannen und 5 Sekunden halten", wiederholungen: "10x", frequenz: "3x taeglich" },
          { name: "Fersenrutschen", anweisung: "Im Liegen die Ferse langsam zum Gesaess ziehen und wieder strecken", wiederholungen: "10x", frequenz: "2x taeglich" },
          { name: "Kniescheibenverschiebung", anweisung: "Kniescheibe vorsichtig nach oben, unten, links und rechts bewegen", wiederholungen: "2 min", frequenz: "2x taeglich" },
        ],
      },
    },
  });

  await prisma.recoveryPlanTemplate.create({
    data: {
      name: "Standard Hueft-TEP",
      opArt: "Hueft-Operation",
      exercises: {
        create: [
          { name: "Gehtraining mit Gehstuetzen", anweisung: "Kurze Strecken im 3-Punkt-Gang, zuerst im Zimmer", wiederholungen: "3x 5 Minuten", frequenz: "taeglich" },
          { name: "Hueftabduktion", anweisung: "Im Liegen das operierte Bein seitlich anheben und langsam absenken", wiederholungen: "10x", frequenz: "2x taeglich" },
        ],
      },
    },
  });

  await prisma.recoveryPlanTemplate.create({
    data: {
      name: "Standard Schulter",
      opArt: "Schulter-Operation",
      exercises: {
        create: [
          { name: "Penderuebung", anweisung: "Oberkoerper leicht vorneigen, den Arm locker haengen lassen und kreisen", wiederholungen: "30 Sekunden", frequenz: "3x taeglich" },
          { name: "Fingerleitern", anweisung: "Mit den Fingern die Wand hochlaufen, so weit wie moeglich", wiederholungen: "10x", frequenz: "2x taeglich" },
        ],
      },
    },
  });

  // ── Patient 1: Maria Hoffmann – Stationaer (IN_VORBEREITUNG) ──────────────
  const p1 = await prisma.patient.create({
    data: {
      user: {
        create: { email: "patient@postsurge.de", passwordHash: pw, name: "Maria Hoffmann", role: "PATIENT" },
      },
      name: "Maria Hoffmann",
      opDatum: new Date("2026-06-15"),
      opArt: "Knie-Operation",
      entlassungsstatus: "IN_VORBEREITUNG",
      postOpPfad: "Standard Knie-TEP",
      checkinAngefordert: false,
      zusammenfassung:
        "Du wurdest am 15.06.2026 erfolgreich am rechten Kniegelenk operiert (Knie-Totalendoprothese). Der Eingriff verlief komplikationslos. In den naechsten Wochen ist es wichtig, die verordneten Uebungen regelmaessig durchzufuehren und die Wunde sauber und trocken zu halten.",
      betreuendArzt: { connect: { id: arztId } },
      clearanceCheck: {
        create: { arztbriefFertig: true, abschlussuntersuchung: true },
      },
      todos: {
        create: [
          { label: "Abholung durch Angehoerige organisieren", done: false },
          { label: "Aufklaerungsvideo zur Wundpflege ansehen", done: true },
          { label: "Auswahl des gewuenschten Reha-Ortes", done: false },
          { label: "Rezepte fuer haeusliche Pflege abholen", done: false },
        ],
      },
      medications: {
        create: [
          { medicationId: medParacetamol.id, dosage: "1 Tablette", frequency: "3x taeglich", einnahmezeit: "morgens, mittags, abends", einnahmenProTag: 3, eingenommenAnzahl: 2, hinweis: "Nicht zusammen mit anderen paracetamolhaltigen Praeparaten einnehmen." },
          { medicationId: medClexane.id, dosage: "1 Fertigspritze", frequency: "1x taeglich", einnahmezeit: "abends", einnahmenProTag: 1, eingenommenAnzahl: 1, hinweis: "Subkutane Injektion in den Bauch - Pflege dokumentiert die Gabe." },
          { medicationId: medPantoprazol.id, dosage: "1 Tablette", frequency: "1x taeglich", einnahmezeit: "morgens nuechtern", einnahmenProTag: 1, eingenommenAnzahl: 0 },
        ],
      },
      exercises: {
        create: [
          { name: "Quadrizeps-Anspannung", anweisung: "Bein durchstrecken, Oberschenkelmuskel anspannen und 5 Sekunden halten", wiederholungen: "10x", frequenz: "3x taeglich", status: "ERLEDIGT", erledigtAm: new Date() },
          { name: "Fersenrutschen", anweisung: "Im Liegen die Ferse langsam zum Gesaess ziehen und wieder strecken", wiederholungen: "10x", frequenz: "2x taeglich", status: "OFFEN" },
          { name: "Kniescheibenverschiebung", anweisung: "Kniescheibe vorsichtig nach oben, unten, links und rechts bewegen", wiederholungen: "2 min", frequenz: "2x taeglich", status: "OFFEN" },
        ],
      },
      termine: {
        create: [
          { titel: "Kontrolltermin Orthopaedie", datum: new Date("2026-07-20T09:30:00"), ort: "Klinik am Park, Raum 204" },
          { titel: "Physiotherapie", datum: new Date("2026-07-14T14:00:00"), ort: "Praxis fuer Physiotherapie Mueller, Elberfelder Str. 12" },
          { titel: "Faeden ziehen", datum: new Date("2026-07-10T10:00:00"), ort: "Station 3B, Stationszimmer" },
        ],
      },
      documents: {
        create: [
          { title: "Entlassungsbrief (Vorabversion)", category: "ENTLASSUNGSBRIEF" },
          { title: "Aufklaerung Wundpflege", category: "AUFKLAERUNG" },
          { title: "Laborbefund praeoperativ", category: "BEFUND", abteilung: "Zentrallabor" },
          { title: "Ueberweisung Physiotherapie", category: "UEBERWEISUNG", fachrichtung: "Physiotherapie", begruendung: "Postoperative Mobilisation nach Knie-TEP rechts" },
        ],
      },
    },
  });

  const p1Levels = [7, 8, 6, 7, 5, 6, 5, 4, 5, 4];
  const p1Fieber = [false, true, false, false, false, false, false, false, false, false];
  for (let i = 0; i < p1Levels.length; i++) {
    const daysAgo = p1Levels.length - 1 - i;
    await prisma.checkIn.create({
      data: {
        patientId: p1.id,
        schmerzlevel: p1Levels[i],
        fieber: p1Fieber[i],
        medsGenommen: true,
        prioFlag: (p1Fieber[i] || p1Levels[i] > 5) ? "HOCH" : "NORMAL",
        arztStatus: daysAgo <= 1 ? "UNGELESEN" : "ERLEDIGT",
        datum: new Date(Date.now() - daysAgo * 86400000),
      },
    });
  }

  const p1Meds = await prisma.patientMedication.findMany({ where: { patientId: p1.id } });
  const p1Exercises = await prisma.patientExercise.findMany({ where: { patientId: p1.id } });
  await prisma.pflegeMassnahme.createMany({
    data: [
      { patientId: p1.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p1Meds[0].id, kommentar: "Paracetamol Morgendosis verabreicht – Schlucken problemlos", durchgefuehrtAm: new Date(Date.now() - 4 * 3600000) },
      { patientId: p1.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p1Meds[1].id, kommentar: "Clexane s.c. rechts perinabel injiziert, keine Roetung", durchgefuehrtAm: new Date(Date.now() - 6 * 3600000) },
      { patientId: p1.id, arztId: pflegeId, typ: "UEBUNG", patientExerciseId: p1Exercises[0].id, kommentar: "Patientin fuehrt Uebung selbststaendig durch, gute Kooperation", durchgefuehrtAm: new Date(Date.now() - 2 * 3600000) },
    ],
  });
  await prisma.pflegeMeldung.create({
    data: {
      patientId: p1.id, arztId: pflegeId, dringlichkeit: 2,
      kommentar: "Patientin klagt ueber staerkere Schwellung am operierten Knie. Wunde weiterhin reizlos, kein Ausfluss. Bitte bei naechster Visite beurteilen.",
      gelesen: false,
    },
  });

  // ── Patient 2: Jonas Weber – Entlassen ────────────────────────────────────
  const p2 = await prisma.patient.create({
    data: {
      user: {
        create: { email: "patient2@postsurge.de", passwordHash: pw, name: "Jonas Weber", role: "PATIENT" },
      },
      name: "Jonas Weber",
      opDatum: new Date("2026-06-10"),
      opArt: "Hueft-Operation",
      entlassungsstatus: "ENTLASSEN",
      naechsterTermin: new Date("2026-07-28"),
      postOpPfad: "Standard Hueft-TEP",
      zusammenfassung:
        "Du wurdest am 10.06.2026 erfolgreich am linken Hueftgelenk operiert (Hueft-Totalendoprothese). Die Operation und der stationaere Aufenthalt verliefen komplikationslos. Wichtig ist das schrittweise Gehtraining und die regelmaessige Einnahme der Schmerzmedikation.",
      betreuendArzt: { connect: { id: arztId } },
      clearanceCheck: {
        create: { arztbriefFertig: true, abschlussuntersuchung: true, nachsorgePlanZugeordnet: true, freigabeErteilt: true },
      },
      todos: {
        create: [
          { label: "Abholung durch Familie organisiert", done: true },
          { label: "Rezepte erhalten", done: true },
          { label: "Physiotherapie-Termin vereinbart", done: true },
        ],
      },
      medications: {
        create: [
          { medicationId: medIbuprofen.id, dosage: "1 Tablette", frequency: "2x taeglich", einnahmezeit: "morgens, abends", einnahmenProTag: 2, eingenommenAnzahl: 2, geaendert: true, hinweis: "Mit ausreichend Wasser und moeglichst zu einer Mahlzeit einnehmen." },
          { medicationId: medBisoprolol.id, dosage: "1/2 Tablette", frequency: "1x taeglich", einnahmezeit: "morgens", einnahmenProTag: 1, eingenommenAnzahl: 1 },
        ],
      },
      exercises: {
        create: [
          { name: "Gehtraining mit Gehstuetzen", anweisung: "Kurze Strecken im 3-Punkt-Gang, zuerst im Zimmer", wiederholungen: "3x 5 Minuten", frequenz: "taeglich", status: "ERLEDIGT", erledigtAm: new Date(Date.now() - 86400000 * 2) },
          { name: "Hueftabduktion", anweisung: "Im Liegen das operierte Bein seitlich anheben und langsam absenken", wiederholungen: "10x", frequenz: "2x taeglich", status: "ERLEDIGT", erledigtAm: new Date(Date.now() - 86400000) },
        ],
      },
      termine: {
        create: [
          { titel: "Kontrolltermin Orthopaedie", datum: new Date("2026-07-28T11:00:00"), ort: "Klinik am Park, Raum 204" },
          { titel: "Roentgenkontrolle", datum: new Date("2026-08-05T08:30:00"), ort: "Radiologie am Marktplatz" },
        ],
      },
      documents: {
        create: [
          { title: "Entlassungsbrief", category: "ENTLASSUNGSBRIEF" },
          { title: "Rezept Ibuprofen 400 mg", category: "REZEPT" },
          { title: "Arbeitsunfaehigkeitsbescheinigung", category: "AU_BESCHEINIGUNG", gueltigVon: new Date("2026-06-10"), gueltigBis: new Date("2026-08-01") },
          { title: "Roentgenbefund Huefte postoperativ", category: "BEFUND", abteilung: "Radiologie" },
        ],
      },
    },
  });

  const p2Levels = [3, 4, 6, 7, 5, 4, 3, 2, 1];
  const p2Fieber = [false, false, false, true, false, false, false, false, false];
  for (let i = 0; i < p2Levels.length; i++) {
    const daysAgo = p2Levels.length - 1 - i;
    await prisma.checkIn.create({
      data: {
        patientId: p2.id,
        schmerzlevel: p2Levels[i],
        fieber: p2Fieber[i],
        medsGenommen: true,
        prioFlag: (p2Fieber[i] || p2Levels[i] > 5) ? "HOCH" : "NORMAL",
        arztStatus: "ERLEDIGT",
        datum: new Date(Date.now() - daysAgo * 86400000 - 86400000 * 10),
      },
    });
  }

  const p2Meds = await prisma.patientMedication.findMany({ where: { patientId: p2.id } });
  await prisma.pflegeMassnahme.create({
    data: { patientId: p2.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p2Meds[0].id, kommentar: "Ibuprofen Abenddosis verabreicht – keine Beschwerden", durchgefuehrtAm: new Date(Date.now() - 86400000 * 5) },
  });
  await prisma.pflegeMeldung.create({
    data: { patientId: p2.id, arztId: pflegeId, dringlichkeit: 2, kommentar: "Patient berichtet ueber leicht erhoehte Schmerzen beim Gehen, Wunde unauffaellig. Verlauf im Rahmen des Normalen.", gelesen: true },
  });

  // ── Patient 3: Lukas Schneider – Bereit zur Entlassung ────────────────────
  const p3 = await prisma.patient.create({
    data: {
      user: {
        create: { email: "patient3@postsurge.de", passwordHash: pw, name: "Lukas Schneider", role: "PATIENT" },
      },
      name: "Lukas Schneider",
      opDatum: new Date("2026-06-28"),
      opArt: "Schulter-Operation",
      entlassungsstatus: "BEREIT",
      postOpPfad: "Standard Schulter",
      zusammenfassung:
        "Du wurdest am 28.06.2026 erfolgreich an der rechten Schulter operiert (arthroskopische Rotatorenmanschettenrekonstruktion). Der Eingriff verlief planmaessig. Fuer die ersten 4 Wochen wird eine Schulterorthese empfohlen.",
      betreuendArzt: { connect: { id: arztId } },
      clearanceCheck: {
        create: { arztbriefFertig: true, abschlussuntersuchung: true, nachsorgePlanZugeordnet: true, freigabeErteilt: false },
      },
      todos: {
        create: [
          { label: "Schulterorthese anpassen lassen", done: true },
          { label: "Physiotherapie-Termin fuer Reha vereinbaren", done: true },
          { label: "Abholung fuer morgen bestaetigt", done: false },
        ],
      },
      medications: {
        create: [
          { medicationId: medMetamizol.id, dosage: "1 Tablette", frequency: "2x taeglich", einnahmezeit: "morgens, abends", einnahmenProTag: 2, eingenommenAnzahl: 2, hinweis: "Bei Unvertraeglichkeit sofort dem Pflegepersonal melden." },
          { medicationId: medPantoprazol.id, dosage: "1 Tablette", frequency: "1x taeglich", einnahmezeit: "morgens nuechtern", einnahmenProTag: 1, eingenommenAnzahl: 1 },
          { medicationId: medClexane.id, dosage: "1 Fertigspritze", frequency: "1x taeglich", einnahmezeit: "abends", einnahmenProTag: 1, eingenommenAnzahl: 0 },
        ],
      },
      exercises: {
        create: [
          { name: "Penderuebung", anweisung: "Oberkoerper leicht vorneigen, den Arm locker haengen lassen und in kleinen Kreisen schwingen", wiederholungen: "30 Sekunden", frequenz: "3x taeglich", status: "ERLEDIGT", erledigtAm: new Date() },
          { name: "Fingerleitern", anweisung: "Mit den Fingern die Wand hochlaufen so weit wie moeglich, ohne Schmerz", wiederholungen: "10x", frequenz: "2x taeglich", status: "OFFEN" },
        ],
      },
      termine: {
        create: [
          { titel: "Entlassung geplant", datum: new Date("2026-07-10T10:00:00"), ort: "Station 2A, Stationszimmer" },
          { titel: "Orthopaedie Nachsorge", datum: new Date("2026-07-24T14:30:00"), ort: "MVZ Orthopaedie, Hauptstrasse 45" },
          { titel: "Physiotherapie (Ersttermin)", datum: new Date("2026-07-15T09:00:00"), ort: "Physiopraxis am Klinikum" },
        ],
      },
      documents: {
        create: [
          { title: "Entlassungsbrief (finale Version)", category: "ENTLASSUNGSBRIEF" },
          { title: "AU-Bescheinigung 4 Wochen", category: "AU_BESCHEINIGUNG", gueltigVon: new Date("2026-06-28"), gueltigBis: new Date("2026-07-25") },
          { title: "Befund Schulter MRT praeoperativ", category: "BEFUND", abteilung: "Radiologie" },
          { title: "Ueberweisung Physiotherapie Schulter", category: "UEBERWEISUNG", fachrichtung: "Physiotherapie", begruendung: "Postoperative Rehabilitation Schulter rechts nach Rotatorenmanschettenrekonstruktion" },
          { title: "Rezept Metamizol 500 mg", category: "REZEPT" },
        ],
      },
    },
  });

  const p3Levels = [8, 7, 6, 6, 5, 4, 3, 2];
  for (let i = 0; i < p3Levels.length; i++) {
    const daysAgo = p3Levels.length - 1 - i;
    await prisma.checkIn.create({
      data: {
        patientId: p3.id, schmerzlevel: p3Levels[i], fieber: false, medsGenommen: true,
        prioFlag: p3Levels[i] > 6 ? "HOCH" : "NORMAL",
        arztStatus: daysAgo === 0 ? "UNGELESEN" : "ERLEDIGT",
        datum: new Date(Date.now() - daysAgo * 86400000),
      },
    });
  }

  const p3Meds = await prisma.patientMedication.findMany({ where: { patientId: p3.id } });
  const p3Exercises = await prisma.patientExercise.findMany({ where: { patientId: p3.id } });
  await prisma.pflegeMassnahme.createMany({
    data: [
      { patientId: p3.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p3Meds[0].id, kommentar: "Metamizol Morgendosis – Patient vertraegt gut", durchgefuehrtAm: new Date(Date.now() - 5 * 3600000) },
      { patientId: p3.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p3Meds[2].id, kommentar: "Clexane s.c. linkes Abdomen injiziert", durchgefuehrtAm: new Date(Date.now() - 10 * 3600000) },
      { patientId: p3.id, arztId: pflegeId, typ: "UEBUNG", patientExerciseId: p3Exercises[0].id, kommentar: "Penderuebung mit guter Ausfuehrung, Patient motiviert", durchgefuehrtAm: new Date(Date.now() - 3 * 3600000) },
    ],
  });
  await prisma.pflegeMeldung.create({
    data: { patientId: p3.id, arztId: pflegeId, dringlichkeit: 1, kommentar: "Patient fragt nach genauem Entlassungstermin. Schmerzlage gut kontrolliert, Stimmung positiv.", gelesen: true },
  });

  // ── Patient 4: Anna Fischer – Stationaer, frisch operiert, kritisch ───────
  const p4 = await prisma.patient.create({
    data: {
      user: {
        create: { email: "patient4@postsurge.de", passwordHash: pw, name: "Anna Fischer", role: "PATIENT" },
      },
      name: "Anna Fischer",
      opDatum: new Date("2026-07-07"),
      opArt: "Wirbelsaeulen-Operation",
      entlassungsstatus: "IN_VORBEREITUNG",
      postOpPfad: "Lendenwirbelsaeule L4/L5",
      checkinAngefordert: true,
      zusammenfassung:
        "Du wurdest am 07.07.2026 an der Lendenwirbelsaeule operiert (Bandscheibenoperation L4/L5). Der Eingriff verlief planmaessig. In den ersten Tagen ist Bettruhe wichtig. Das Pflegeteam unterstuetzt dich bei allen Massnahmen.",
      betreuendArzt: { connect: { id: arztId } },
      clearanceCheck: {
        create: { arztbriefFertig: false, abschlussuntersuchung: false, nachsorgePlanZugeordnet: false, freigabeErteilt: false },
      },
      todos: {
        create: [
          { label: "Reha-Antrag ausfuellen", done: false },
          { label: "Angehoerige informieren", done: false },
          { label: "Physiotherapie-Verordnung besprechen", done: false },
        ],
      },
      medications: {
        create: [
          { medicationId: medMetamizol.id, dosage: "1 Tablette", frequency: "3x taeglich", einnahmezeit: "morgens, mittags, abends", einnahmenProTag: 3, eingenommenAnzahl: 1, hinweis: "Bei Unvertraeglichkeit oder Blutdruckabfall sofort melden." },
          { medicationId: medMetoprolol.id, dosage: "1/2 Tablette", frequency: "2x taeglich", einnahmezeit: "morgens, abends", einnahmenProTag: 2, eingenommenAnzahl: 1 },
          { medicationId: medClexane.id, dosage: "1 Fertigspritze", frequency: "1x taeglich", einnahmezeit: "abends 22:00 Uhr", einnahmenProTag: 1, eingenommenAnzahl: 0 },
        ],
      },
      exercises: {
        create: [
          { name: "Atemuebung", anweisung: "Tief einatmen, 3 Sekunden halten, langsam ausatmen – hilft Komplikationen vorzubeugen", wiederholungen: "10x", frequenz: "stuendlich", status: "OFFEN" },
          { name: "Zehenkreisen", anweisung: "Beide Fuesse im Wechsel kreisen – Thromboseprophylaxe", wiederholungen: "20x je Seite", frequenz: "alle 2 Stunden", status: "OFFEN" },
        ],
      },
      termine: {
        create: [
          { titel: "Visite Dr. Klein", datum: new Date("2026-07-10T08:00:00"), ort: "Station 4C, Zimmer 412" },
          { titel: "Physiotherapie Erstbefund", datum: new Date("2026-07-11T11:00:00"), ort: "Therapieraum 2, Erdgeschoss" },
        ],
      },
      documents: {
        create: [
          { title: "Operationsbericht LWS L4/L5", category: "BEFUND", abteilung: "Unfallchirurgie & Orthopaedie" },
          { title: "Aufklaerung Bandscheibenoperation", category: "AUFKLAERUNG" },
        ],
      },
    },
  });

  const p4Data = [
    { level: 9, fieber: false, daysAgo: 2 },
    { level: 8, fieber: true,  daysAgo: 1 },
    { level: 7, fieber: false, daysAgo: 0 },
  ];
  for (const d of p4Data) {
    await prisma.checkIn.create({
      data: {
        patientId: p4.id, schmerzlevel: d.level, fieber: d.fieber, medsGenommen: d.daysAgo < 2,
        prioFlag: "HOCH", arztStatus: "UNGELESEN",
        datum: new Date(Date.now() - d.daysAgo * 86400000),
      },
    });
  }

  const p4Meds = await prisma.patientMedication.findMany({ where: { patientId: p4.id } });
  await prisma.pflegeMassnahme.create({
    data: { patientId: p4.id, arztId: pflegeId, typ: "MEDIKATION", patientMedicationId: p4Meds[0].id, kommentar: "Metamizol Morgendosis verabreicht – Patientin schlaeft danach", durchgefuehrtAm: new Date(Date.now() - 3 * 3600000) },
  });
  await prisma.pflegeMeldung.createMany({
    data: [
      { patientId: p4.id, arztId: pflegeId, dringlichkeit: 3, kommentar: "Patientin hatte heute Nacht Fieber 38,4 Grad. Antipyretika verabreicht, Fieber auf 37,5 Grad gesunken. Bitte baldige aerztliche Beurteilung.", gelesen: false, createdAt: new Date(Date.now() - 8 * 3600000) },
      { patientId: p4.id, arztId: pflegeId, dringlichkeit: 2, kommentar: "Patientin aeussert Schmerzen beim Lagewechsel (VAS 8/10). Aktuelle Schmerzmedikation scheint nicht ausreichend zu wirken.", gelesen: false, createdAt: new Date(Date.now() - 1 * 3600000) },
    ],
  });

  console.log("Demo-Seed erfolgreich angelegt:");
  console.log("  arzt@postsurge.de     - Arzt-Dashboard (Dr. Sarah Klein)");
  console.log("  pflege@postsurge.de   - Pflege-Dashboard (Tom Becker)");
  console.log("  admin@postsurge.de    - Admin-Dashboard");
  console.log("  patient@postsurge.de  - Maria Hoffmann  (Stationaer, Knie-OP)");
  console.log("  patient2@postsurge.de - Jonas Weber     (Entlassen, Hueft-OP)");
  console.log("  patient3@postsurge.de - Lukas Schneider (Bereit zur Entlassung, Schulter-OP)");
  console.log("  patient4@postsurge.de - Anna Fischer    (Stationaer, frisch, kritisch)");
  console.log("  Alle Passwoerter: demo1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
