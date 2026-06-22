import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-[#1d1d1f]">PostSurge</p>
            <p className="text-xs text-[#86868b]">Patientenansicht &middot; {session?.user?.name}</p>
          </div>
          <nav className="flex gap-5 text-sm font-medium text-[#1d1d1f]/70">
            <Link href="/patient" className="transition-colors hover:text-[#0071e3]">
              Übersicht
            </Link>
            <Link href="/patient/genesungsplan" className="transition-colors hover:text-[#0071e3]">
              Genesungsplan
            </Link>
            <Link href="/patient/medikation" className="transition-colors hover:text-[#0071e3]">
              Medikation
            </Link>
            <Link href="/patient/termine" className="transition-colors hover:text-[#0071e3]">
              Termine
            </Link>
            <Link href="/patient/dokumente" className="transition-colors hover:text-[#0071e3]">
              Dokumente
            </Link>
            <Link href="/patient/verlauf" className="transition-colors hover:text-[#0071e3]">
              Verlauf
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 bg-[#f5f5f7] p-6">{children}</main>
    </div>
  );
}
