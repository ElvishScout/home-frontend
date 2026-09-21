import { ReactNode } from "react";
import { notFound } from "next/navigation";
import registry from "virtual:mdx-registry";
import ArticleTemplate from "./article-template";
import "katex/dist/katex.min.css";

export default async function ArticlesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const key = `articles/${path.join("/")}`;
  const entry = registry[key];
  if (!entry) return notFound();

  // navigation 在构建期已按 index 解析成 registry key，这里换成标题与页面路径传入模板。
  const navItem = (key: string | undefined) => {
    if (!key) return undefined;
    const target = registry[key];
    return { href: `/${key}`, title: target?.title ?? "未命名文章" };
  };

  return (
    <ArticleTemplate
      key={path.join("/")}
      entry={entry}
      prev={navItem(entry.navigation.prev)}
      next={navItem(entry.navigation.next)}
    >
      {children}
    </ArticleTemplate>
  );
}
