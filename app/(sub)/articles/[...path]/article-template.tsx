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
  entry: ArticleRegistryEntry;
  prev?: ArticleNavItem;
  next?: ArticleNavItem;
}

export default function ArticleTemplate({ children, entry, prev, next }: ArticleTemplateProps) {
  const mainRef = useRef<HTMLElement>(null);
  const spyLockedRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 点击 TOC 后锁定 scroll-spy，平滑滚动途中不被经过的标题抢走高亮。
  // 解锁走两条路：原生 scrollend（精确）；滚动事件停 200ms 的兜底——
  // 覆盖不支持 scrollend 的浏览器（Firefox / 旧版 Safari），以及点击的
  // 目标已在视口内、根本不产生滚动（也就不会触发 scrollend）的情形。
  const unlockScrolling = () => {
    spyLockedRef.current = false;
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
  };

  const scheduleUnlock = () => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(unlockScrolling, 200);
  };

  useEffect(() => {
    if (!mainRef.current) return;

    // 标题的锚点 id 已由 rehype-slug 在渲染时写入。
    const headings = Array.from(
      mainRef.current.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6"),
    );

    // Scroll-spy: 当前激活项 = 已越过视口顶部的最后一个标题；
    // 还没有标题越过时（页面顶部），高亮第一个标题。
    const onScroll = () => {
      if (spyLockedRef.current) {
        scheduleUnlock();
        return;
      }

      let current: string | null = headings[0]?.id ?? null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 0) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", unlockScrolling);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", unlockScrolling);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, []);

  return (
    <div className="flex gap-12">
      <aside className="w-52 shrink-0 max-lg:hidden">
        <div className="sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
          <TableOfContents
            tree={entry.headingTree}
            activeId={activeId}
            onClick={(id) => {
              spyLockedRef.current = true;
              setActiveId(id);
              scheduleUnlock();
            }}
          />
        </div>
      </aside>
      <div className="min-w-0 grow">
        <div className="mx-auto max-w-3xl">
          <PageHead
            id={entry.headingTree.children?.[0]?.id}
            tag="ARTICLE"
            title={entry.title ?? "未命名文章"}
            meta={entry.lastModified ? `UPDATED ${formatDate(entry.lastModified)}` : undefined}
          />
          <main ref={mainRef} className="prose max-w-full! [&>h1:first-child]:hidden">
            {children}
          </main>
          <footer className="mt-16 border-t-3 border-ink pt-6">
            {(prev || next) && (
              <nav className="mb-8 grid grid-cols-2 gap-4">
                {prev ? <NavCard dir="prev" item={prev} /> : <span />}
                {next ? <NavCard dir="next" item={next} /> : <span />}
              </nav>
            )}
            <Link
              href="/articles"
              className="group/link wipe-acid relative isolate inline-flex items-center gap-3 overflow-hidden py-2 font-spacemono text-xs font-bold tracking-16"
            >
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-expo group-hover/link:-translate-x-1.5"
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
      className={`group/nav wipe-ink relative isolate flex flex-col gap-1.5 overflow-hidden border-2 border-ink px-4 py-3.5 shadow-hard-4 shadow-ink transition-[box-shadow,translate] duration-300 hover:translate-0.5 hover:shadow-none ${
        isPrev ? "" : "col-start-2 items-end text-right"
      }`}
    >
      <span className="flex items-center gap-2 font-spacemono text-xs font-bold tracking-16 group-hover/nav:text-paper">
        <span
          aria-hidden
          className={`inline-block transition-transform duration-500 ease-expo ${
            isPrev ? "group-hover/nav:-translate-x-1" : "group-hover/nav:translate-x-1"
          }`}
        >
          {isPrev ? "←" : "→"}
        </span>
        {isPrev ? "PREV" : "NEXT"}
      </span>
      <span className="font-zh text-sm leading-snug font-black group-hover/nav:text-paper">
        {item.title}
      </span>
    </Link>
  );
}
