"use client";

import { useState, useTransition } from "react";
import { submitCheckIn } from "./actions";

export function CheckInForm({ naechsterTermin }: { naechsterTermin: string | null }) {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [schmerzlevel, setSchmerzlevel] = useState(3);
  const [fieber, setFieber] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(formData: FormData) {
    if (photoPreview) formData.set("fotoDataUrl", photoPreview);
    startTransition(async () => {
      await submitCheckIn(formData);
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <section className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#34c759]/10 text-2xl text-[#34c759]">
          ✓
        </div>
        <p className="text-lg font-medium text-[#1d1d1f]">
          Vielen Dank. Deine Daten wurden erfolgreich an dein Behandlungsteam übermittelt.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setPhotoPreview(null);
          }}
          className="mt-4 text-sm font-medium text-[#0071e3] hover:underline"
        >
          Weiteres Check-in erfassen
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {naechsterTermin && (
        <section className="rounded-2xl border border-black/5 bg-[#0071e3]/5 p-4 text-sm text-[#1d1d1f]">
          Dein nächster Kontrolltermin: <strong>{naechsterTermin}</strong>
        </section>
      )}
      <form
        action={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-7 shadow-sm"
      >
        <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">Tägliches Check-in</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="schmerzlevel" className="text-sm font-medium text-[#1d1d1f]">
            Schmerzlevel (1&ndash;10)
          </label>
          <input
            id="schmerzlevel"
            name="schmerzlevel"
            type="range"
            min={1}
            max={10}
            value={schmerzlevel}
            onChange={(e) => setSchmerzlevel(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-[#86868b]">Aktueller Wert: {schmerzlevel}/10</span>
        </div>

        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input
            type="checkbox"
            name="fieber"
            checked={fieber}
            onChange={(e) => setFieber(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Ich habe Fieber
        </label>

        {(schmerzlevel >= 8 || fieber) && (
          <p className="rounded-xl bg-[#ff3b30]/10 p-3 text-sm text-[#ff3b30]">
            Deine Angaben deuten auf eine ernstere Situation hin. Wende dich bei starken Schmerzen
            oder hohem Fieber bitte direkt an dein Behandlungsteam oder die Notaufnahme.
          </p>
        )}

        <label className="flex items-center gap-2 text-sm text-[#1d1d1f]">
          <input type="checkbox" name="medsGenommen" className="h-4 w-4 rounded" defaultChecked />
          Ich habe meine Medikamente eingenommen
        </label>

        <div className="flex flex-col gap-2">
          <label htmlFor="foto" className="text-sm font-medium text-[#1d1d1f]">
            Foto der OP-Narbe (optional)
          </label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm text-[#86868b] file:mr-3 file:rounded-full file:border-0 file:bg-[#f5f5f7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1d1d1f] hover:file:bg-black/10"
          />
          {photoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Vorschau Wundfoto"
              className="mt-2 h-32 w-32 rounded-xl object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#0071e3] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
        >
          {pending ? "Wird übermittelt…" : "Check-in absenden"}
        </button>
      </form>
    </div>
  );
}
