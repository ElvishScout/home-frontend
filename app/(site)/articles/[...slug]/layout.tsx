import { ReactNode } from "react";
import registry from "virtual:mdx-registry";
import { slugToRegistryKey } from "@/lib/articles";
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

  return (
    <ArticleTemplate key={slug.join("/")} entry={entry}>
      {children}
    </ArticleTemplate>
  );
}
