/**
 * registry 的 key（`articles/foo/bar.mdx`，纯 markdown 文档为 `.md`）与路由之间的换算。
 */

import registry from "virtual:mdx-registry";
import type { ArticleRegistryEntry } from "virtual:mdx-registry";

/** slug 段数组 → registry key */
export function slugToRegistryKey(slug: string[], extension?: "md" | "mdx"): string {
  return `articles/${slug.join("/")}.${extension ?? "mdx"}`;
}

/** registry key → 页面路径 */
export function registryKeyToHref(key: string): string {
  return `/${key.replace(/\.mdx?$/, "")}`;
}

/** slug → registry entry 与文件扩展名（.mdx 优先，其次 .md）；都不存在返回 null */
export function findArticle(
  slug: string[],
): { entry: ArticleRegistryEntry; extension: "md" | "mdx" } | null {
  for (const extension of ["mdx", "md"] as const) {
    const entry = registry[slugToRegistryKey(slug, extension)] as ArticleRegistryEntry | undefined;
    if (entry) return { entry, extension };
  }
  return null;
}
