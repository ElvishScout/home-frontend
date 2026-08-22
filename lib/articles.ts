/**
 * registry 的 key（`articles/foo/bar.mdx`）与路由之间的换算。
 * 三处使用方：[...slug]/page.tsx、articles/page.tsx、[...slug]/template.tsx。
 */

/** slug 段数组 → registry key */
export function slugToRegistryKey(slug: string[]): string {
  return `articles/${slug.join("/")}.mdx`;
}

/** 页面路径（`/articles/foo/bar`）→ registry key */
export function pathnameToRegistryKey(pathname: string): string {
  return `${pathname.slice(1)}.mdx`;
}

/** registry key → 页面路径 */
export function registryKeyToHref(key: string): string {
  return `/${key.replace(/\.mdx$/, "")}`;
}
