"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ArticleRegistryEntry } from "virtual:mdx-registry";
import { formatDate } from "@/lib/date";
import { PageHead } from "../../components/page-head";
import TableOfContents from "../table-of-contents";

interface ArticleTemplateProps {
  children: ReactNode;
  entry: ArticleRegistryEntry | undefined;
}

export default function ArticleTemplate({ children, entry }: ArticleTemplateProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!articleRef.current) return;

    // 标题的锚点 id 已由 rehype-heading-ids 在渲染时写入。
    const headings = Array.from(
      articleRef.current.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6"),
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
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-10 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2">
          {entry?.headingTree ? (
            <TableOfContents tree={entry.headingTree} activeId={activeId} />
          ) : null}
        </div>
      </aside>
      <div className="min-w-0 grow">
        <div className="mx-auto max-w-4xl">
          <PageHead
            tag="ARTICLE"
            title={entry?.title ?? "未命名文章"}
            meta={entry?.lastModified ? `UPDATED ${formatDate(entry.lastModified)}` : undefined}
          />
          <article ref={articleRef} className="prose max-w-full! [&>h1:first-child]:hidden">
            {children}
          </article>
          <div className="border-ink mt-16 border-t-3 pt-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
