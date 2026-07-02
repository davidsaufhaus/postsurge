import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav-link";
import { PostSurgeLogo } from "@/components/logo";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-md">
        {/* Top bar: Logo + Nutzerinfo + Logout */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <PostSurgeLogo size="sm" />
            <p className="hidden text-xs text-[#86868b] sm:block">
              Patientenansicht &middot; {session?.user?.name}
            </p>
          </div>
          <LogoutButton />
        </div>
        {/* Scrollbare Nav */}
        <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 [&::-webkit-scrollbar]:hidden">
          <NavLink href="/patient">Übersicht</NavLink>
          <NavLink href="/patient/genesungsplan">Genesungsplan</NavLink>
          <NavLink href="/patient/medikation">Medikation</NavLink>
          <NavLink href="/patient/termine">Termine</NavLink>
          <NavLink href="/patient/dokumente">Dokumente</NavLink>
          <NavLink href="/patient/verlauf">Verlauf</NavLink>
        </nav>
      </header>
      <main className="flex-1 bg-[#f5f5f7] p-3 sm:p-6">{children}</main>
    </div>
  );
}
