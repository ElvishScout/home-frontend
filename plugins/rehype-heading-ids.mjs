// @ts-check

/**
 * Rehype plugin: assign `heading-N` anchor ids to h1–h6 in document order.
 *
 * The numbering matches the ids generated in the mdx-registry loader, so table
 * of contents links point at the rendered headings without any client-side
 * patching.
 *
 * @returns {(tree: any) => void}
 */
export default function rehypeHeadingIds() {
  return (tree) => {
    let index = 0;

    /**
     * @param {any} node
     */
    function visit(node) {
      if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
        node.properties ??= {};
        // Respect an id written in the source, but still consume the index so
        // numbering stays aligned with the registry.
        node.properties.id ??= `heading-${index}`;
        index++;
      }
      for (const child of node.children ?? []) {
        visit(child);
      }
    }

    visit(tree);
  };
}
