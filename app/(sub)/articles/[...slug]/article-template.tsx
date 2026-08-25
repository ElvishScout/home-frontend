"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import type { ArticleRegistryEntry } from "virtual:mdx-registry";
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
    const headings = Array.from(articleRef.current.querySelectorAll<HTMLHeadingElement>("h1,h2,h3,h4,h5,h6"));

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
    <div className="flex gap-10">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4 scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {entry?.headingTree && <TableOfContents tree={entry.headingTree} activeId={activeId} />}
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
