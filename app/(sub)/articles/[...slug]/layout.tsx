import { ReactNode } from "react";
import registry from "virtual:mdx-registry";
import { registryKeyToHref, slugToRegistryKey } from "@/lib/articles";
import ArticleTemplate from "./article-template";

export default async function ArticlesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const entry = registry[slugToRegistryKey(slug)];

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
      prev={navItem(entry?.navigation.prev ?? null)}
      next={navItem(entry?.navigation.next ?? null)}
    >
      {children}
    </ArticleTemplate>
  );
}
