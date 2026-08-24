/**
 * registry 的 key（`articles/foo/bar.mdx`）与路由之间的换算。
 */

/** slug 段数组 → registry key */
export function slugToRegistryKey(slug: string[]): string {
  return `articles/${slug.join("/")}.mdx`;
}

/** registry key → 页面路径 */
export function registryKeyToHref(key: string): string {
  return `/${key.replace(/\.mdx$/, "")}`;
}
