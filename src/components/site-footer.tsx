import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/60 px-6 py-4 text-xs text-[#86868b]">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} PostSurge GmbH, Hagen</span>
        <nav className="flex items-center gap-4">
          <Link href="/impressum" className="hover:text-[#1d1d1f] hover:underline">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-[#1d1d1f] hover:underline">Datenschutz</Link>
          <Link href="/hilfe" className="hover:text-[#1d1d1f] hover:underline">Hilfe</Link>
          <Link href="/support" className="hover:text-[#1d1d1f] hover:underline">Support</Link>
        </nav>
      </div>
    </footer>
  );
}
