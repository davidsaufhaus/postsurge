"use client";

import { useRef, useState, useTransition } from "react";
import { sendMeldung } from "../actions";

const DRINGLICHKEIT_LABEL: Record<number, string> = { 1: "Niedrig", 2: "Mittel", 3: "Hoch" };

export function MeldungForm({ patientId }: { patientId: string }) {
  const [pending, startTransition] = useTransition();
  const [dringlichkeit, setDringlichkeit] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          await sendMeldung(patientId, dringlichkeit, (fd.get("kommentar") as string) ?? "");
          formRef.current?.reset();
          setSent(true);
        })
      }
      className="flex flex-col gap-3"
    >
      <div className="flex gap-2">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setDringlichkeit(level)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              dringlichkeit === level
                ? level === 3
                  ? "bg-[#ff3b30] text-white"
                  : level === 2
                    ? "bg-[#ff9500] text-white"
                    : "bg-[#0071e3] text-white"
                : "bg-black/5 text-[#1d1d1f]"
            }`}
          >
            {DRINGLICHKEIT_LABEL[level]}
          </button>
        ))}
      </div>
      <textarea
        name="kommentar"
        required
        placeholder="Beschreibung der Auffälligkeit…"
        rows={3}
        className="rounded-lg border border-black/10 bg-[#f5f5f7] px-3 py-2 text-sm outline-none focus:border-[#0071e3]"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-[#1d1d1f] px-4 py-1.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
      >
        {pending ? "Wird gesendet…" : "An Ärzteteam melden"}
      </button>
      {sent && <p className="text-xs text-[#34c759]">Meldung wurde gesendet.</p>}
    </form>
  );
}
