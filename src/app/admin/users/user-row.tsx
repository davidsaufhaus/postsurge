"use client";

import { useTransition, useState } from "react";
import { toggleUserActive, changeUserRole, resetPassword } from "./actions";
import type { User } from "@prisma/client";

const ROLE_LABEL: Record<string, string> = {
  PATIENT: "Patient",
  DOCTOR: "Arzt",
  NURSE: "Pflegekraft",
  ADMIN: "Administrator",
};

export function UserRow({ user }: { user: User }) {
  const [pending, startTransition] = useTransition();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  return (
    <tr className="border-b border-black/5">
      <td className="px-4 py-3 font-medium text-[#1d1d1f]">{user.name}</td>
      <td className="px-4 py-3 text-[#86868b]">{user.email}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={user.role}
          disabled={pending}
          onChange={(e) => startTransition(() => changeUserRole(user.id, e.target.value))}
          className="rounded-lg border border-black/10 bg-[#f5f5f7] px-2 py-1 text-xs outline-none focus:border-[#0071e3]"
        >
          {Object.entries(ROLE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            user.active ? "bg-[#34c759]/10 text-[#34c759]" : "bg-black/5 text-[#86868b]"
          }`}
        >
          {user.active ? "Aktiv" : "Deaktiviert"}
        </span>
      </td>
      <td className="flex gap-2 px-4 py-3">
        <button
          disabled={pending}
          onClick={() => startTransition(() => toggleUserActive(user.id, !user.active))}
          className="rounded-full border border-black/10 px-2.5 py-1 text-xs transition-colors hover:bg-black/5 disabled:opacity-60"
        >
          {user.active ? "Deaktivieren" : "Aktivieren"}
        </button>
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const pwd = await resetPassword(user.id);
              setResetMessage(`Neues Passwort: ${pwd}`);
            })
          }
          className="rounded-full border border-black/10 px-2.5 py-1 text-xs transition-colors hover:bg-black/5 disabled:opacity-60"
        >
          Passwort zurücksetzen
        </button>
        {resetMessage && <span className="text-xs text-[#0071e3]">{resetMessage}</span>}
      </td>
    </tr>
  );
}
