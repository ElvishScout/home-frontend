declare module "virtual:mdx-registry" {
  export interface HeadingTreeRoot {
    children: HeadingTreeNode[];
  }

  export interface HeadingTreeNode {
    id: string;
    level: number;
    text: string;
    children?: HeadingTreeNode[];
  }

  export interface ArticleRegistryEntry {
    path: string;
    title: string | undefined;
    lastModified: Date | null;
    frontmatter: Record<string, unknown>;
    headingTree: HeadingTreeRoot;
    /** frontmatter navigation 经构建期解析、校验后的目标文章 registry key */
    navigation: { prev: string | null; next: string | null };
  }

  const registry: Record<string, ArticleRegistryEntry>;
  export default registry;
}
