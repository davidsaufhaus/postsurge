export default function SupportPage() {
  return (
    <main className="mx-auto max-w-2xl flex flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Technischer Support</h1>
      <p className="text-sm text-[#86868b]">
        Bei technischen Problemen oder Fragen zur Nutzung von PostSurge stehen wir Ihnen gerne zur
        Verfügung.
      </p>

      <section className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Kontakt</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[#1d1d1f]">E-Mail Support</span>
            <a href="mailto:support@postsurge.de" className="text-[#0071e3] hover:underline">
              support@postsurge.de
            </a>
            <span className="text-xs text-[#86868b]">Antwortzeit: werktags innerhalb von 24 Stunden</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[#1d1d1f]">Telefon (Bürozeiten Mo–Fr 8–17 Uhr)</span>
            <a href="tel:+492331123456" className="text-[#0071e3] hover:underline">
              +49 (0) 2331 / 123 456 0
            </a>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-[#1d1d1f]">Administrator</span>
            <a href="mailto:admin@postsurge.de" className="text-[#0071e3] hover:underline">
              admin@postsurge.de
            </a>
            <span className="text-xs text-[#86868b]">
              Für Anfragen zu Nutzerkonten, Passwortrücksetzung und Systemzugängen.
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1d1d1f]">Anschrift</h2>
        <address className="not-italic text-sm text-[#86868b]">
          <strong className="text-[#1d1d1f]">PostSurge GmbH</strong><br />
          Elberfelder Straße 12<br />
          58095 Hagen<br />
          Deutschland<br />
          <br />
          <a href="mailto:info@postsurge.de" className="text-[#0071e3] hover:underline">
            info@postsurge.de
          </a>
        </address>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#0071e3]/10 bg-[#0071e3]/5 p-5 text-sm">
        <p className="font-medium text-[#1d1d1f]">Medizinischer Notfall</p>
        <p className="text-[#86868b]">
          PostSurge ist kein Notfalldienst. Bei einem medizinischen Notfall wählen Sie bitte
          <strong className="text-[#1d1d1f]"> 112</strong> oder wenden Sie sich direkt an die nächste
          Notaufnahme.
        </p>
      </section>
    </main>
  );
}
