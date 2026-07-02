"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/arzt" || href === "/admin" || href === "/patient"
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[#0071e3]/10 text-[#0071e3]"
          : "text-[#1d1d1f]/70 hover:bg-black/[0.03] hover:text-[#1d1d1f]"
      }`}
    >
      {children}
    </Link>
  );
}
