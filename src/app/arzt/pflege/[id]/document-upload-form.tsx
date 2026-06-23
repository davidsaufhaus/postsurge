"use client";

import { useRef, useState, useTransition } from "react";
import { uploadDocument } from "../actions";

const CATEGORY_LABEL: Record<string, string> = {
  ENTLASSUNGSBRIEF: "Entlassbrief",
  BEFUND: "Befund",
  AU_BESCHEINIGUNG: "Arbeitsunfähigkeitsbescheinigung",
  UEBERWEISUNG: "Überweisung",
  AUFKLAERUNG: "Aufklärung",
  REZEPT: "Rezept",
  SONSTIGES: "Sonstiges",
};

const inputClass =
  "rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30";

export function DocumentUploadForm({ patientId }: { patientId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(formData: FormData) {
    if (!fileDataUrl) {
      setError("Bitte eine Datei auswählen.");
      return;
    }
    formData.set("dataUrl", fileDataUrl);
    startTransition(async () => {
      const res = await uploadDocument(patientId, formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setError(null);
      setFileDataUrl(null);
      setFileName(null);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl bg-[#f5f5f7] p-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Titel</label>
        <input name="title" required placeholder="z.B. Entlassbrief Orthopädie" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Kategorie</label>
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Bitte wählen…
          </option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Datei (PDF, Bild)</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="text-sm text-[#86868b] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#1d1d1f] hover:file:bg-black/10"
        />
        {fileName && <span className="text-xs text-[#34c759]">{fileName} ausgewählt</span>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Lädt hoch…" : "Dokument hochladen"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
