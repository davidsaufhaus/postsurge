import Link from "next/link";
import { PostSurgeLogo } from "@/components/logo";

export default function DatenschutzPage() {
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

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[#1d1d1f]">Datenschutzerklärung</h1>

        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">1. Verantwortliche Stelle</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten im Sinne der
              Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#1d1d1f]">
              PostSurge GmbH<br />
              Elberfelder Straße 12, 58095 Hagen<br />
              E-Mail:{" "}
              <a href="mailto:datenschutz@postsurge.de" className="text-[#0071e3] hover:underline">
                datenschutz@postsurge.de
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">2. Art der verarbeiteten Daten</h2>
            <p className="mb-2 text-sm text-[#86868b]">PostSurge verarbeitet folgende Datenkategorien:</p>
            <ul className="flex flex-col gap-2">
              {[
                ["Stammdaten", "Name, E-Mail-Adresse, Passwort (bcrypt-gehashed, nie im Klartext)"],
                ["Medizinische Daten", "OP-Art, OP-Datum, Schmerzlevel, Fieberstatus, Medikamentenpläne, Genesungsübungen, Wundfotos"],
                ["Kommunikationsdaten", "Pflege-Meldungen, Arzt-Kommentare, Check-in-Protokolle"],
                ["Termindaten", "Nachsorgetermine, Kontrolltermine"],
                ["Dokumente", "Entlassbriefe, Befunde, AU-Bescheinigungen, Überweisungen, Rezepte"],
              ].map(([titel, beschr]) => (
                <li key={titel} className="rounded-xl bg-[#f5f5f7] p-3 text-sm">
                  <span className="font-medium text-[#1d1d1f]">{titel}: </span>
                  <span className="text-[#86868b]">{beschr}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">3. Zweck und Rechtsgrundlage</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Die Verarbeitung erfolgt ausschließlich zur digitalen Unterstützung der postoperativen
              Nachsorge. Rechtsgrundlagen:
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[#86868b]">
              <li className="flex gap-2">
                <span className="font-medium text-[#1d1d1f]">Art. 6 Abs. 1 lit. b DSGVO</span>
                — Verarbeitung zur Vertragserfüllung (Nachsorgebehandlung)
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[#1d1d1f]">Art. 9 Abs. 2 lit. h DSGVO</span>
                — Verarbeitung besonderer Kategorien (Gesundheitsdaten) für medizinische Zwecke durch Fachpersonal
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[#1d1d1f]">Art. 6 Abs. 1 lit. c DSGVO</span>
                — Erfüllung gesetzlicher Pflichten (Dokumentationspflicht im Gesundheitswesen)
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">4. Speicherung und Sicherheit</h2>
            <ul className="flex flex-col gap-2 text-sm text-[#86868b]">
              <li>Alle Daten werden auf Servern innerhalb der Europäischen Union gespeichert.</li>
              <li>Der Zugang ist rollenbasiert gesichert (Patient, Arzt, Pflege, Admin).</li>
              <li>Passwörter werden ausschließlich als bcrypt-Hash gespeichert — kein Klartext.</li>
              <li>Wundfotos und Dokumente werden verschlüsselt als Base64-Datenstrom gespeichert.</li>
              <li>Alle Verbindungen sind TLS-verschlüsselt (HTTPS).</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">5. Speicherdauer</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Medizinische Daten werden entsprechend der gesetzlichen Aufbewahrungspflichten im
              Gesundheitswesen für mindestens 10 Jahre gespeichert (§ 630f BGB). Nach Ablauf dieser
              Frist werden die Daten automatisch gelöscht, sofern keine gesetzlichen Gründe einer
              Löschung entgegenstehen.
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">6. Weitergabe an Dritte</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nicht, es sei denn,
              dies ist zur Vertragserfüllung erforderlich, Sie haben ausdrücklich eingewilligt, oder
              wir sind gesetzlich dazu verpflichtet.
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">7. Ihre Rechte</h2>
            <ul className="flex flex-col gap-2 text-sm text-[#86868b]">
              {[
                ["Art. 15 DSGVO", "Auskunft über gespeicherte Daten"],
                ["Art. 16 DSGVO", "Berichtigung unrichtiger Daten"],
                ["Art. 17 DSGVO", "Löschung Ihrer Daten (\"Recht auf Vergessenwerden\")"],
                ["Art. 18 DSGVO", "Einschränkung der Verarbeitung"],
                ["Art. 20 DSGVO", "Datenübertragbarkeit"],
                ["Art. 21 DSGVO", "Widerspruch gegen die Verarbeitung"],
              ].map(([art, recht]) => (
                <li key={art} className="flex gap-2">
                  <span className="font-medium text-[#1d1d1f]">{art}</span>— {recht}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[#86868b]">
              Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
              <a href="mailto:datenschutz@postsurge.de" className="text-[#0071e3] hover:underline">
                datenschutz@postsurge.de
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">8. Datenschutzbeauftragter</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Unseren betrieblichen Datenschutzbeauftragten erreichen Sie unter:{" "}
              <a href="mailto:datenschutz@postsurge.de" className="text-[#0071e3] hover:underline">
                datenschutz@postsurge.de
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">9. Beschwerderecht</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für
              NRW ist dies die Landesbeauftragte für Datenschutz und Informationsfreiheit (LDI NRW):
            </p>
            <p className="mt-2 text-sm text-[#1d1d1f]">
              Kavalleriestraße 2–4, 40213 Düsseldorf<br />
              <a href="https://www.ldi.nrw.de" className="text-[#0071e3] hover:underline" target="_blank" rel="noopener noreferrer">
                www.ldi.nrw.de
              </a>
            </p>
          </section>

          <p className="text-xs text-[#86868b]">Stand: Juli 2026</p>

          <div className="flex gap-4 text-sm">
            <Link href="/impressum" className="text-[#0071e3] hover:underline">
              Impressum →
            </Link>
            <Link href="/hilfe" className="text-[#0071e3] hover:underline">
              Hilfe →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
