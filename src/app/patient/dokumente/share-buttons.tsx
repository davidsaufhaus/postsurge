"use client";

import { useState } from "react";

export function ShareButtons() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
      <button
        onClick={() => setMessage("Anfrage zur Weiterleitung an deinen Hausarzt wurde vorbereitet. (Prototyp – kein echter Versand)")}
        className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
      >
        Mit Hausarzt teilen
      </button>
      <button
        onClick={() => setMessage("ZIP-Paket mit allen Unterlagen wird vorbereitet. (Prototyp – kein echter Download)")}
        className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
      >
        Alle Dokumente als ZIP herunterladen
      </button>
      {message && <p className="w-full text-sm text-[#0071e3]">{message}</p>}
    </div>
  );
}
