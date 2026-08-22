"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 按当前路径生成的面包屑，如 `articles / moe / ep-survey`。 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, i) => ({
    text: decodeURIComponent(segment),
    href: `/${segments.slice(0, i + 1).join("/")}`,
    last: i === segments.length - 1,
  }));

  return (
    <nav aria-label="面包屑" className="mx-auto mb-8 w-3xl max-w-full text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {crumb.last ? (
              <span aria-current="page" className="font-medium text-gray-900">
                {crumb.text}
              </span>
            ) : (
              <>
                <Link href={crumb.href} className="text-gray-500 hover:text-gray-900">
                  {crumb.text}
                </Link>
                <span aria-hidden className="text-gray-300">
                  /
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
