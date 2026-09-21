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
    index?: number;
    title?: string;
    lastModified?: Date;
    frontmatter: Record<string, unknown>;
    headingTree: HeadingTreeRoot;
    navigation: { prev?: string; next?: string };
  }

  const registry: Record<string, ArticleRegistryEntry>;
  export default registry;
}
