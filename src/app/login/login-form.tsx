"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (!res || res.error) {
      setError("Login fehlgeschlagen: E-Mail oder Passwort falsch.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-[#1d1d1f]">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-black/10 bg-[#f5f5f7] px-3 py-2.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-[#1d1d1f]">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-lg border border-black/10 bg-[#f5f5f7] px-3 py-2.5 text-sm outline-none transition-shadow focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/30"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#0071e3] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#0058b9] disabled:opacity-60"
      >
        {pending ? "Anmelden…" : "Anmelden"}
      </button>
    </form>
  );
}
