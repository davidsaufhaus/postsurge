import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav-link";

export default async function ArztLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/80 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0071e3] text-sm font-semibold text-white">
              P
            </span>
            <div>
              <p className="text-[15px] font-semibold leading-tight tracking-tight text-[#1d1d1f]">PostSurge</p>
              <p className="text-xs leading-tight text-[#86868b]">
                {session?.user?.role === "NURSE" ? "Pflegeansicht" : "Arztansicht"} &middot; {session?.user?.name}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {session?.user?.role === "DOCTOR" && (
              <>
                <NavLink href="/arzt">Dashboard</NavLink>
                <NavLink href="/arzt/clearance">Entlassungs-Clearance</NavLink>
              </>
            )}
            <NavLink href="/arzt/pflege">Pflege-Dashboard</NavLink>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 bg-[#f5f5f7] p-6">{children}</main>
    </div>
  );
}
