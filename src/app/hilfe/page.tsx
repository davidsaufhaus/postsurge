import Link from "next/link";
import { PostSurgeLogo } from "@/components/logo";

export default function HilfePage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <PostSurgeLogo size="md" />
          <Link href="/login" className="text-sm text-[#0071e3] hover:underline">
            Zurück zur Anmeldung
          </Link>
        </div>

        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-[#1d1d1f]">Hilfe &amp; Anleitung</h1>
        <p className="mb-8 text-sm text-[#86868b]">
          Hier finden Sie eine Erklärung aller Funktionen von PostSurge – gegliedert nach Ihrer Rolle.
        </p>

        {/* Schnellnavigation */}
        <nav className="mb-6 flex flex-wrap gap-2">
          {["Patienten", "Ärzte", "Pflegepersonal", "Häufige Fragen"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-6">
          {/* Patienten */}
          <section id="patienten" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">Für Patientinnen &amp; Patienten</h2>
            <div className="flex flex-col divide-y divide-black/5">
              {[
                {
                  icon: "🏠",
                  title: "Übersicht",
                  desc: "Die Startseite nach dem Login. Sie sehen Ihren Entlassungsstatus, offene To-Dos und den Kontakt zu Ihrem Behandlungsteam. Falls Ihr Arzt ein zusätzliches Check-in angefordert hat, erscheint oben ein orangefarbener Hinweis.",
                },
                {
                  icon: "✅",
                  title: "Tägliches Check-in",
                  desc: "Geben Sie täglich Ihren aktuellen Schmerzlevel (1–10), ob Sie Fieber haben und ob Sie Ihre Medikamente eingenommen haben ein. Sie können optional ein Foto der Narbe hochladen. Bei Schmerzlevel ≥ 8 oder Fieber erscheint automatisch ein Warnhinweis. Klicken Sie auf \"Check-in absenden\", um die Daten an Ihr Behandlungsteam zu übermitteln.",
                },
                {
                  icon: "💊",
                  title: "Genesungsplan",
                  desc: "Zeigt Ihre physiotherapeutischen Übungen und Medikamente für den heutigen Tag. Haken Sie Einträge ab, sobald Sie sie erledigt bzw. eingenommen haben — genau wie auf einer To-do-Liste.",
                },
                {
                  icon: "📅",
                  title: "Termine",
                  desc: "Alle Ihre Nachsorgetermine in einer Kalenderansicht. Klicken Sie auf einen Tag, um die Termine dieses Tages zu sehen. Über den Button \"In Kalender exportieren\" können Sie einen Termin in Ihren persönlichen Kalender (iPhone, Android, Outlook) übernehmen. Einzelne Termine können verschoben oder abgesagt werden.",
                },
                {
                  icon: "📄",
                  title: "Dokumente",
                  desc: "Ihr Behandlungsteam stellt Ihnen hier Dokumente bereit: Entlassbriefe, Befunde, Arbeitsunfähigkeitsbescheinigungen, Überweisungen und Rezepte. Klicken Sie auf \"Herunterladen\", um ein Dokument zu speichern.",
                },
                {
                  icon: "📈",
                  title: "Verlauf",
                  desc: "Zeigt Ihre letzten Check-ins als Balkendiagramm. Die Höhe jedes Balkens entspricht Ihrem damaligen Schmerzlevel (0–10). Rote Balken markieren Tage, an denen Sie Fieber hatten. Darunter finden Sie eine detaillierte Liste aller Einträge.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#86868b]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ärzte */}
          <section id="ärzte" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">Für Ärztinnen &amp; Ärzte</h2>
            <div className="flex flex-col divide-y divide-black/5">
              {[
                {
                  icon: "📬",
                  title: "Arzt-Dashboard",
                  desc: "Zeigt alle ungelesenen Check-ins nach Priorität sortiert. Check-ins mit Fieber oder Schmerzlevel > 5 erscheinen rot markiert ganz oben. Rechts daneben sehen Sie offene Meldungen vom Pflegepersonal. Mit den Aktionsbuttons können Sie einen Check-in als erledigt markieren, den Patienten einbestellen oder einen Rückruf durch die Pflege anfordern.",
                },
                {
                  icon: "🏥",
                  title: "Entlassungs-Clearance",
                  desc: "Strukturierte Checkliste für jeden Patienten vor der Entlassung: Arztbrief fertig, Abschlussuntersuchung, Nachsorgeplan zugeordnet, Freigabe erteilt. Erst wenn alle vier Punkte abgehakt sind, gilt der Patient als \"Bereit zur Entlassung\". Außerdem können Sie hier einen Genesungsplan-Template zuweisen und den Entlassungsstatus auf \"Entlassen\" setzen.",
                },
                {
                  icon: "🩺",
                  title: "Pflege-Dashboard & Patientendetail",
                  desc: "Vollständige Patientenakte: Schmerzverlauf der letzten 7 Tage, Medikationsplan verwalten (+ Button zum Hinzufügen), Übungen hinzufügen, Wundfotos einsehen, Dokumente hochladen. Ärzte sehen zusätzlich einen \"Check-in anfordern\"-Button, um den Patienten direkt zur Eingabe aufzufordern.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#86868b]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pflege */}
          <section id="pflegepersonal" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">Für Pflegepersonal</h2>
            <div className="flex flex-col divide-y divide-black/5">
              {[
                {
                  icon: "📋",
                  title: "Pflege-Dashboard",
                  desc: "Listenübersicht aller betreuten Patienten mit Entlassungsstatus (Stationär = blau, Bereit = orange, Entlassen = grün) und offenen Arztanfragen. Ein orangefarbenes Badge zeigt \"Rückruf anfordern\", ein rotes \"Patient einbestellen\". Klicken Sie auf einen Patienten für die Detailansicht.",
                },
                {
                  icon: "📝",
                  title: "Patientendetail",
                  desc: "Zeigt den Schmerzverlauf, Medikationsplan, Übungsliste, Wundfotos und bisherige Meldungen. Über das Formular unten können Sie eine neue Meldung an das Ärzteteam senden (Dringlichkeit 1–3 wählen). Dokumente können per Datei-Upload hinzugefügt werden.",
                },
                {
                  icon: "📨",
                  title: "Arztanfragen bearbeiten",
                  desc: "Wenn ein Arzt \"Rückruf anfordern\" oder \"Patient einbestellen\" geklickt hat, erscheint im Patientendetail ein orangefarbener Banner. Nach Erledigung klicken Sie auf \"Als erledigt markieren\", um die Anfrage zu schließen.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#86868b]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="häufige-fragen" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">Häufige Fragen</h2>
            <div className="flex flex-col divide-y divide-black/5">
              {[
                {
                  q: "Ich habe mein Passwort vergessen.",
                  a: "Wenden Sie sich an den Support oder Ihren Administrator. Eine automatische Passwort-Zurücksetzen-Funktion ist in Planung. Kontakt: support@postsurge.de",
                },
                {
                  q: "Ich sehe keine Dokumente.",
                  a: "Dokumente werden von Ihrem Behandlungsteam hochgeladen. Wenden Sie sich an Ihre Pflegekraft oder Ihren Arzt, wenn Sie ein bestimmtes Dokument vermissen.",
                },
                {
                  q: "Was passiert, wenn ich kein Check-in ausfülle?",
                  a: "Ihr Behandlungsteam erhält dann keine aktuellen Daten von Ihnen. Wir empfehlen, das Check-in täglich zur gleichen Uhrzeit auszufüllen — z. B. morgens nach dem Aufstehen.",
                },
                {
                  q: "Gibt es Erinnerungen für Medikamente und Übungen?",
                  a: "Eine automatische Erinnerungsfunktion (Push-Benachrichtigungen) ist für eine zukünftige Version geplant. Bis dahin empfehlen wir, tägliche Wecker auf dem Smartphone einzurichten.",
                },
                {
                  q: "Meine Eingaben werden nicht gespeichert.",
                  a: "Stellen Sie sicher, dass Sie den Absenden-Button gedrückt haben und eine stabile Internetverbindung besteht. Prüfen Sie auch, ob Sie noch eingeloggt sind — bei langer Inaktivität wird die Sitzung automatisch beendet.",
                },
                {
                  q: "Kann ich PostSurge auf dem Smartphone nutzen?",
                  a: "Ja, PostSurge ist für Mobilgeräte optimiert. Öffnen Sie einfach die Webadresse im Browser Ihres Smartphones. Eine native App ist für eine spätere Version geplant.",
                },
              ].map((item) => (
                <div key={item.q} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-medium text-[#1d1d1f]">{item.q}</p>
                  <p className="mt-1 text-sm text-[#86868b]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Support CTA */}
          <section className="rounded-2xl border border-[#0071e3]/20 bg-[#0071e3]/5 p-6">
            <p className="font-medium text-[#1d1d1f]">Noch Fragen?</p>
            <p className="mt-1 text-sm text-[#86868b]">
              Unser Support-Team hilft Ihnen gerne weiter.
            </p>
            <Link
              href="/support"
              className="mt-3 inline-block rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white hover:bg-[#0058b9]"
            >
              Support kontaktieren →
            </Link>
          </section>

          <div className="flex gap-4 text-sm">
            <Link href="/impressum" className="text-[#0071e3] hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="text-[#0071e3] hover:underline">Datenschutz</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
