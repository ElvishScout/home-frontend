import { ReactNode } from "react";
import { notFound } from "next/navigation";
import registry from "virtual:mdx-registry";
import { findArticle, registryKeyToHref } from "@/lib/articles";
import ArticleTemplate from "./article-template";

export default async function ArticlesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return notFound();
  const entry = article.entry;

  // navigation 在构建期已解析成 registry key，这里换成标题与页面路径传入模板。
  const navItem = (key: string | null) => {
    if (!key) return undefined;
    const target = registry[key];
    return { href: registryKeyToHref(key), title: target?.title ?? "未命名文章" };
  };

  return (
    <ArticleTemplate
      key={slug.join("/")}
      entry={entry}
      prev={navItem(entry.navigation.prev)}
      next={navItem(entry.navigation.next)}
    >
      {children}
    </ArticleTemplate>
  );
}
