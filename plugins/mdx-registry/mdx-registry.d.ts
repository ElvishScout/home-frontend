interface HeadingTreeNode {
  id: string;
  level: number;
  text: string;
  children: HeadingTreeNode[];
}

interface ArticleRegistryEntry {
  path: string;
  title: string | undefined;
  lastModified: Date | null;
  headingTree: HeadingTreeNode;
}

declare module "virtual:mdx-registry" {
  const registry: Record<string, ArticleRegistryEntry>;
  export default registry;
}
