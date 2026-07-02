import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import { NavLink } from "@/components/nav-link";
import { PostSurgeLogo } from "@/components/logo";

export default async function ArztLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-md">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <PostSurgeLogo size="sm" />
            <p className="hidden text-xs text-[#86868b] sm:block">
              {session?.user?.role === "NURSE" ? "Pflegeansicht" : "Arztansicht"} &middot; {session?.user?.name}
            </p>
          </div>
          <LogoutButton />
        </div>
        {/* Scrollbare Nav */}
        <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 [&::-webkit-scrollbar]:hidden">
          {session?.user?.role === "DOCTOR" && (
            <>
              <NavLink href="/arzt">Dashboard</NavLink>
              <NavLink href="/arzt/clearance">Entlassungs-Clearance</NavLink>
            </>
          )}
          <NavLink href="/arzt/pflege">Pflege-Dashboard</NavLink>
        </nav>
      </header>
      <main className="flex-1 bg-[#f5f5f7] p-3 sm:p-6">{children}</main>
    </div>
  );
}
