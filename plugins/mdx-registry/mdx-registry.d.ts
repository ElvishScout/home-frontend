declare module "virtual:mdx-registry" {
  export interface HeadingTreeNode {
    id: string;
    level: number;
    text: string;
    children: HeadingTreeNode[];
  }

  export interface ArticleRegistryEntry {
    path: string;
    title: string | undefined;
    lastModified: Date | null;
    frontmatter: Record<string, unknown>;
    headingTree: HeadingTreeNode;
  }

  const registry: Record<string, ArticleRegistryEntry>;
  export default registry;
}
