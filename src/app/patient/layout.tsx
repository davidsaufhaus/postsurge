import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav-link";
import { PostSurgeLogo } from "@/components/logo";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/80 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <PostSurgeLogo size="sm" />
            <p className="text-xs leading-tight text-[#86868b]">Patientenansicht &middot; {session?.user?.name}</p>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink href="/patient">Übersicht</NavLink>
            <NavLink href="/patient/genesungsplan">Genesungsplan</NavLink>
            <NavLink href="/patient/medikation">Medikation</NavLink>
            <NavLink href="/patient/termine">Termine</NavLink>
            <NavLink href="/patient/dokumente">Dokumente</NavLink>
            <NavLink href="/patient/verlauf">Verlauf</NavLink>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 bg-[#f5f5f7] p-6">{children}</main>
    </div>
  );
}
