declare module "virtual:mdx-components" {
  import type { ComponentType } from "react";
  import type { ArticleRegistryEntry } from "virtual:mdx-registry";

  /** 注册表 key → 懒加载文章组件；key 集合与 virtual:mdx-registry 完全一致 */
  const components: Record<string, () => Promise<{ default: ComponentType<ArticleRegistryEntry> }>>;
  export default components;
}
