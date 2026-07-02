import Link from "next/link";
import { PostSurgeLogo } from "@/components/logo";

export default function ImpressumPage() {
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

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-[#1d1d1f]">Impressum</h1>

        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">Angaben gemäß § 5 TMG</h2>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">
              <strong>PostSurge GmbH</strong><br />
              Elberfelder Straße 12<br />
              58095 Hagen<br />
              Deutschland
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">Kontakt</h2>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">
              Telefon: +49 (0) 2331 / 123 456 0<br />
              E-Mail:{" "}
              <a href="mailto:info@postsurge.de" className="text-[#0071e3] hover:underline">
                info@postsurge.de
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">Handelsregister</h2>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">
              Registergericht: Amtsgericht Hagen<br />
              Registernummer: HRB 12345<br />
              USt-IdNr.: DE 123456789
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">Geschäftsführung</h2>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">
              Dr. med. Anna Becker<br />
              David Saufhaus
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">
              Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)
            </h2>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">
              David Saufhaus<br />
              Elberfelder Straße 12<br />
              58095 Hagen
            </p>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1d1d1f]">Haftungshinweis</h2>
            <p className="text-sm leading-relaxed text-[#86868b]">
              PostSurge ist ein digitales Nachsorge-Unterstützungssystem und ersetzt keine medizinische
              Beratung, Diagnose oder Behandlung. Bei medizinischen Notfällen wenden Sie sich
              bitte sofort an den Notruf <strong className="text-[#1d1d1f]">112</strong> oder die
              nächste Notaufnahme.
            </p>
          </section>

          <div className="flex gap-4 text-sm">
            <Link href="/datenschutz" className="text-[#0071e3] hover:underline">
              Datenschutzerklärung →
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
