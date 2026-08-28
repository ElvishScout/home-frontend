"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ArticleRegistryEntry } from "virtual:mdx-registry";
import { formatDate } from "@/lib/date";
import { PageHead } from "../../components/page-head";
import TableOfContents from "../table-of-contents";

interface ArticleNavItem {
  href: string;
  title: string;
}

interface ArticleTemplateProps {
  children: ReactNode;
  entry: ArticleRegistryEntry | undefined;
  prev?: ArticleNavItem;
  next?: ArticleNavItem;
}

export default function ArticleTemplate({ children, entry, prev, next }: ArticleTemplateProps) {
  const mainRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // 标题的锚点 id 已由 rehype-slug 在渲染时写入。
    const headings = Array.from(
      mainRef.current.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6"),
    );

    // Scroll-spy: 当前激活项 = 视口顶部参考线以上最后一个标题；
    // 还没有标题越过参考线（页面顶部）时，高亮第一个标题。
    const onScroll = () => {
      let current: string | null = headings[0]?.id ?? null;
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
    <div className="flex gap-12">
      <aside className="w-52 shrink-0 max-lg:hidden">
        <div className="sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
          {entry?.headingTree ? (
            <TableOfContents tree={entry.headingTree} activeId={activeId} />
          ) : null}
        </div>
      </aside>
      <div className="min-w-0 grow">
        <div className="mx-auto max-w-3xl">
          <PageHead
            id={entry?.headingTree.children[0]?.id}
            tag="ARTICLE"
            title={entry?.title ?? "未命名文章"}
            meta={entry?.lastModified ? `UPDATED ${formatDate(entry.lastModified)}` : undefined}
          />
          <main ref={mainRef} className="prose max-w-full! [&>article>h1:first-child]:hidden">
            {children}
          </main>
          <footer className="border-ink mt-16 border-t-3 pt-6">
            {(prev || next) && (
              <nav className="mb-8 grid grid-cols-2 gap-4">
                {prev ? <NavCard dir="prev" item={prev} /> : <span />}
                {next ? <NavCard dir="next" item={next} /> : <span />}
              </nav>
            )}
            <Link
              href="/articles"
              className="group/link font-spacemono tracking-16 relative isolate inline-flex items-center gap-3 overflow-hidden py-2 text-xs font-bold"
            >
              <span
                aria-hidden
                className="bg-acid ease-expo absolute inset-0 -z-10 transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/link:[clip-path:inset(0_0_0_0)]"
              />
              <span
                aria-hidden
                className="ease-expo inline-block transition-transform duration-500 group-hover/link:-translate-x-1.5"
              >
                ←
              </span>
              <span>全部文章 · ALL POSTS</span>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}

/** 上一篇 / 下一篇导航卡：直角描边 + 硬阴影，悬停 clip-path 擦除反色。 */
function NavCard({ dir, item }: { dir: "prev" | "next"; item: ArticleNavItem }) {
  const isPrev = dir === "prev";
  return (
    <Link
      href={item.href}
      className={`group/nav border-ink shadow-ink-4 relative isolate flex flex-col gap-1.5 overflow-hidden border-2 px-4 py-3.5 transition-[box-shadow,translate] duration-300 hover:translate-0.5 hover:shadow-none ${
        isPrev ? "" : "col-start-2 items-end text-right"
      }`}
    >
      <span
        aria-hidden
        className="bg-ink ease-expo absolute inset-0 -z-10 transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/nav:[clip-path:inset(0_0_0_0)]"
      />
      <span className="font-spacemono tracking-16 group-hover/nav:text-paper flex items-center gap-2 text-xs font-bold">
        <span
          aria-hidden
          className={`ease-expo inline-block transition-transform duration-500 ${
            isPrev ? "group-hover/nav:-translate-x-1" : "group-hover/nav:translate-x-1"
          }`}
        >
          {isPrev ? "←" : "→"}
        </span>
        {isPrev ? "PREV" : "NEXT"}
      </span>
      <span className="font-zh group-hover/nav:text-paper text-sm leading-snug font-black">
        {item.title}
      </span>
    </Link>
  );
}
