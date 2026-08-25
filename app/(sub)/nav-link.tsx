"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 页眉导航项：当前所在栏目高亮为 acid。 */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`font-spacemono text-xs font-bold tracking-[0.14em] transition-colors duration-300 hover:text-acid ${
        active ? "text-acid" : ""
      }`}
    >
      {label}
    </Link>
  );
}
