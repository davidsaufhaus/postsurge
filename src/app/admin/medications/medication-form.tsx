"use client";

import { useActionState, useEffect, useRef } from "react";
import { createMedication } from "./actions";

const inputClass =
  "rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30";

const DARREICHUNGSFORMEN = ["Tablette", "Kapsel", "Saft", "Tropfen", "Salbe", "Injektion", "Zäpfchen"];

export function MedicationForm() {
  const [result, formAction, pending] = useActionState(createMedication, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (result === "ok") formRef.current?.reset();
  }, [result]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Handelsname</label>
        <input name="name" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Wirkstoff</label>
        <input name="wirkstoff" required placeholder="z.B. Ibuprofen" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Standardstärke</label>
        <input name="strength" required placeholder="z.B. 500mg" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Darreichungsform</label>
        <select name="form" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Bitte wählen…
          </option>
          {DARREICHUNGSFORMEN.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Code</label>
        <input name="code" required placeholder="eindeutig" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Speichert…" : "Medikament anlegen"}
      </button>
      {result && result !== "ok" && <p className="w-full text-sm text-red-600">{result}</p>}
    </form>
  );
}
