/** 路径段数组 → registry key */
export function pathToRegistryKey(path: string[]): string {
  return `articles/${path.join("/")}`;
}

/** registry key → 页面路径 */
export function registryKeyToHref(key: string): string {
  return `/${key}`;
}
