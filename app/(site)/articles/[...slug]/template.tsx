"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import registry from "virtual:mdx-registry";
import TableOfContents from "../table-of-contents";

function Breadcrumbs() {
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

export default function ArticlesTemplate({ children }: { children: ReactNode }) {
  const articleRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);

  const entry = registry[`${pathname.slice(1)}.mdx`];
  const headingTree = entry?.headingTree ?? null;

  useEffect(() => {
    if (!articleRef.current) return;

    // 标题的锚点 id 已由 rehype-heading-ids 在渲染时写入。
    const headings = Array.from(
      articleRef.current.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6"),
    );

    // Scroll-spy: 当前激活项 = 视口顶部参考线以上最后一个标题。
    const onScroll = () => {
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 100) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
          {headingTree && <TableOfContents tree={headingTree} activeId={activeId} />}
        </div>
      </aside>
      <main className="grow min-w-0">
        <Breadcrumbs />
        <article ref={articleRef} className="mx-auto w-3xl max-w-full prose">
          {children}
        </article>
      </main>
    </div>
  );
}
