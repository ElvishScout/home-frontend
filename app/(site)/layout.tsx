import Link from "next/link";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/home", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/articles", label: "文章" },
  { href: "/contact", label: "联系" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex w-7xl max-w-full items-center gap-6 px-6 py-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-gray-600 hover:text-gray-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-7xl max-w-full grow px-6 py-10">{children}</main>
    </>
  );
}
