"use client";

import { useRef, useState, useTransition } from "react";
import { createTemplate } from "./actions";

const inputClass =
  "rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30";

export function TemplateForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createTemplate(undefined, formData);
      setResult(res);
      if (res === "ok") formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Name der Vorlage</label>
        <input name="name" required placeholder="z.B. Standard Knie-TEP" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">OP-Art</label>
        <input name="opArt" required placeholder="z.B. Knie-TEP" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Speichert…" : "Vorlage anlegen"}
      </button>
      {result && result !== "ok" && <p className="w-full text-sm text-red-600">{result}</p>}
    </form>
  );
}
