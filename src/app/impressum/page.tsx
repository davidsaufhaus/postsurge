export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl flex flex-col gap-8 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Impressum &amp; Datenschutz</h1>

      {/* Impressum */}
      <section className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Impressum</h2>
        <p className="text-sm text-[#1d1d1f]">
          <strong>PostSurge GmbH</strong><br />
          Elberfelder Straße 12<br />
          58095 Hagen<br />
          Deutschland
        </p>
        <p className="text-sm text-[#1d1d1f]">
          Geschäftsführung: Dr. med. Anna Becker, David Saufhaus<br />
          Handelsregister: Amtsgericht Hagen, HRB 12345<br />
          USt-IdNr.: DE 123456789
        </p>
        <p className="text-sm text-[#1d1d1f]">
          E-Mail: <a href="mailto:info@postsurge.de" className="text-[#0071e3] hover:underline">info@postsurge.de</a><br />
          Telefon: +49 (0) 2331 / 123 456 0
        </p>
        <p className="text-sm text-[#86868b]">
          Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV: David Saufhaus, Elberfelder Straße 12, 58095 Hagen.
        </p>
      </section>

      {/* Datenschutz */}
      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Datenschutzerklärung</h2>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">1. Verantwortliche Stelle</h3>
          <p className="text-sm text-[#86868b]">
            Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten im Sinne der DSGVO ist die
            PostSurge GmbH, Elberfelder Straße 12, 58095 Hagen (Kontakt s. Impressum).
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">2. Verarbeitete Daten und Zweck</h3>
          <p className="text-sm text-[#86868b]">
            PostSurge verarbeitet medizinische und personenbezogene Daten ausschließlich zur digitalen
            Nachsorgeunterstützung nach operativen Eingriffen. Die Rechtsgrundlage bilden Art. 6 Abs. 1 lit. b
            DSGVO (Vertragserfüllung) sowie Art. 9 Abs. 2 lit. h DSGVO (medizinische Versorgung).
          </p>
          <ul className="ml-4 list-disc text-sm text-[#86868b]">
            <li>Name, E-Mail-Adresse, Passwort (gehashed)</li>
            <li>Medizinische Daten: OP-Art, Schmerzlevel, Fieber, Wundfotos</li>
            <li>Medikamentenpläne und Genesungsübungen</li>
            <li>Terminvereinbarungen und Arztdokumente</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">3. Speicherung und Sicherheit</h3>
          <p className="text-sm text-[#86868b]">
            Alle Daten werden auf Servern innerhalb der EU gespeichert. Der Zugang ist rollenbasiert
            gesichert; medizinische Daten sind nur für autorisiertes Personal zugänglich. Passwörter
            werden ausschließlich als bcrypt-Hash gespeichert.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">4. Ihre Rechte</h3>
          <p className="text-sm text-[#86868b]">
            Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
            Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Wenden Sie sich
            dazu an <a href="mailto:datenschutz@postsurge.de" className="text-[#0071e3] hover:underline">datenschutz@postsurge.de</a>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">5. Datenschutzbeauftragter</h3>
          <p className="text-sm text-[#86868b]">
            Unseren Datenschutzbeauftragten erreichen Sie unter{" "}
            <a href="mailto:datenschutz@postsurge.de" className="text-[#0071e3] hover:underline">datenschutz@postsurge.de</a>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f]">6. Beschwerderecht</h3>
          <p className="text-sm text-[#86868b]">
            Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren. Zuständig ist
            die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).
          </p>
        </div>
      </section>

      {/* Barrierefreiheit */}
      <section className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Barrierefreiheit</h2>
        <p className="text-sm text-[#86868b]">
          PostSurge ist bemüht, diese Anwendung barrierefrei zugänglich zu machen. Bei Problemen mit der
          Barrierefreiheit wenden Sie sich bitte an{" "}
          <a href="mailto:info@postsurge.de" className="text-[#0071e3] hover:underline">info@postsurge.de</a>.
        </p>
      </section>
    </main>
  );
}
