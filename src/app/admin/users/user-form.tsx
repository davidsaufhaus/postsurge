"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createUser } from "./actions";

const inputClass =
  "rounded-lg border border-black/10 bg-[#f5f5f7] px-2.5 py-1.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30";

export function UserForm() {
  const [result, formAction, pending] = useActionState(createUser, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState("PATIENT");

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
        <label className="text-xs font-medium text-[#86868b]">Name</label>
        <input name="name" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">E-Mail</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Rolle</label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Arzt</option>
          <option value="NURSE">Pflegekraft</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>
      {role === "PATIENT" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#86868b]">OP-Art</label>
          <input name="opArt" placeholder="z.B. Knie-Operation" className={inputClass} />
        </div>
      )}
      {(role === "DOCTOR" || role === "NURSE") && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#86868b]">Fachabteilung</label>
          <input name="fachabteilung" placeholder="z.B. Orthopädie" className={inputClass} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#86868b]">Initial-Passwort</label>
        <input name="password" placeholder="demo1234" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Speichert…" : "Account anlegen"}
      </button>
      {result && result !== "ok" && <p className="w-full text-sm text-red-600">{result}</p>}
    </form>
  );
}
