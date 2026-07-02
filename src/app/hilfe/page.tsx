export default function HilfePage() {
  return (
    <main className="mx-auto max-w-2xl flex flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Hilfe &amp; Funktionen</h1>
      <p className="text-sm text-[#86868b]">
        Hier finden Sie eine Übersicht aller Funktionen von PostSurge – gegliedert nach Nutzerrolle.
      </p>

      {/* Patienten */}
      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Für Patientinnen &amp; Patienten</h2>
        <ul className="flex flex-col gap-4">
          {[
            {
              title: "Übersicht",
              desc: "Zeigt Ihren aktuellen Entlassungsstatus, offene To-Dos, Medikamente und den Kontakt zu Ihrem Behandlungsteam auf einen Blick.",
            },
            {
              title: "Tägliches Check-in",
              desc: "Melden Sie täglich Ihren Schmerzlevel, ob Sie Fieber haben und ob Sie Ihre Medikamente eingenommen haben. Optional können Sie ein Foto der Operationsnarbe hochladen.",
            },
            {
              title: "Genesungsplan",
              desc: "Sehen und haken Sie Ihre physiotherapeutischen Übungen und Medikamente für den heutigen Tag ab.",
            },
            {
              title: "Termine",
              desc: "Alle Nachsorgetermine in einer Kalenderansicht. Termine können verschoben oder abgesagt werden. Per Klick können Sie Termine in Ihren persönlichen Kalender exportieren (ICS).",
            },
            {
              title: "Dokumente",
              desc: "Ihr Behandlungsteam stellt Ihnen hier Entlassbriefe, Befunde, AU-Bescheinigungen, Überweisungen und Rezepte bereit – zum Ansehen und Herunterladen.",
            },
            {
              title: "Verlauf",
              desc: "Balkendiagramm mit Ihrem Schmerzlevel der letzten Check-ins. Rote Balken zeigen Tage mit Fieber.",
            },
          ].map((item) => (
            <li key={item.title} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1d1d1f]">{item.title}</span>
              <span className="text-sm text-[#86868b]">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ärzte */}
      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Für Ärztinnen &amp; Ärzte</h2>
        <ul className="flex flex-col gap-4">
          {[
            {
              title: "Arzt-Dashboard",
              desc: "Überblick über alle eingegangenen Check-ins mit Prioritätskennzeichnung (Fieber oder hoher Schmerzlevel). Offene Pflege-Meldungen werden rechts daneben angezeigt.",
            },
            {
              title: "Entlassungs-Clearance",
              desc: "Checkliste zur strukturierten Entlassungsvorbereitung: Arztbrief, Abschlussuntersuchung, Nachsorgeplan und Freigabe. Status wird automatisch aktualisiert.",
            },
            {
              title: "Patientendetail (Pflege-Ansicht)",
              desc: "Vollständige Übersicht je Patient: Medikationsplan verwalten, Übungen hinzufügen, Check-in anfordern und Dokumente hochladen.",
            },
          ].map((item) => (
            <li key={item.title} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1d1d1f]">{item.title}</span>
              <span className="text-sm text-[#86868b]">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pflege */}
      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Für Pflegepersonal</h2>
        <ul className="flex flex-col gap-4">
          {[
            {
              title: "Pflege-Dashboard",
              desc: "Liste aller betreuten Patienten mit aktuellem Entlassungsstatus und offenen Arztanfragen (Rückruf, Einbestellen).",
            },
            {
              title: "Patientendetail",
              desc: "Schmerzverlauf, Medikations- und Übungsliste, Wundfotos, Meldungen an das Ärzteteam und Dokumentenupload – alles an einem Ort.",
            },
            {
              title: "Pflege-Meldungen",
              desc: "Auffälligkeiten können mit Dringlichkeitsstufe (1–3) direkt an das Ärzteteam gemeldet werden.",
            },
          ].map((item) => (
            <li key={item.title} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1d1d1f]">{item.title}</span>
              <span className="text-sm text-[#86868b]">{item.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Häufige Fragen</h2>
        <ul className="flex flex-col gap-4">
          {[
            {
              q: "Ich habe mein Passwort vergessen.",
              a: 'Wenden Sie sich an Ihren Administrator oder das Support-Team (siehe "Support"-Seite). Eine automatische Passwort-Zurücksetzen-Funktion ist in Planung.',
            },
            {
              q: "Meine Daten werden nicht gespeichert.",
              a: "Stellen Sie sicher, dass Sie nach jedem Check-in den Absenden-Button geklickt haben und eine stabile Internetverbindung besteht.",
            },
            {
              q: "Ich sehe keine Dokumente.",
              a: "Dokumente werden von Ihrem Behandlungsteam hochgeladen. Wenden Sie sich an Ihre Pflegekraft oder Ihren Arzt, wenn Sie etwas Bestimmtes erwarten.",
            },
            {
              q: "Erinnerungen für Medikamente und Übungen",
              a: "Eine automatische Erinnerungsfunktion ist für eine zukünftige Version geplant. Bis dahin empfehlen wir, Wecker auf dem Smartphone einzurichten.",
            },
          ].map((item) => (
            <li key={item.q} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-[#1d1d1f]">{item.q}</span>
              <span className="text-sm text-[#86868b]">{item.a}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
