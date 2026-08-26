// @ts-check

import { readFileSync } from "node:fs";
import { dirname, relative as _relative, resolve, sep } from "node:path";
import { createProcessor } from "@mdx-js/mdx";
import { glob } from "glob";
import remarkFrontmatter from "remark-frontmatter";
import serialize from "serialize-javascript";
import { parse as parseYaml } from "yaml";
import { gitDates } from "./git-date.mjs";

// 类型的唯一来源是 plugins/mdx-registry/mdx-registry.d.ts（TS 侧共用）。
/**
 * @typedef {import("virtual:mdx-registry").ArticleRegistryEntry} ArticleRegistryEntry
 * @typedef {import("virtual:mdx-registry").HeadingTreeNode} HeadingTreeNode
 */

/**
 * Options accepted by this loader (via `loaders: [{ loader, options }]`).
 *
 * @typedef {Object} ArticleRegistryLoaderOptions
 * @property {string | string[]} [pattern]
 */

/**
 * Plain text of an mdast node: leaf nodes contribute their `value`, containers
 * the concatenation of their children (emphasis, links, inline code unwrap to
 * their inner text).
 *
 * @param {any} node
 * @returns {string}
 */
function textOf(node) {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

/**
 * Parse an MDX file with remark (the same parser MDX itself uses, so code
 * fences, JSX blocks, and inline markup are all handled correctly) and extract:
 *
 * - the heading tree: headings nested by level, with ids assigned in document
 *   order so the client can re-attach them to the rendered DOM headings by
 *   index;
 * - the frontmatter: the first `---` YAML block parsed into a plain object
 *   (remark-frontmatter is registered so the block is a `yaml` node, not
 *   thematic breaks).
 *
 * @param {string} file  Absolute file path.
 * @returns {{ headingTree: HeadingTreeNode, frontmatter: Record<string, unknown> }}
 */
function readArticle(file) {
  const content = readFileSync(file, "utf8");
  const mdast = createProcessor().use(remarkFrontmatter).parse({ value: content, path: file });

  /** @type {Array<{ id: string, level: number, text: string }>} */
  const items = [];
  /** @type {Record<string, unknown>} */
  let frontmatter = {};

  /**
   * @param {any} node
   */
  function collect(node) {
    if (node.type === "yaml" && node.value) {
      try {
        frontmatter = /** @type {Record<string, unknown>} */ (parseYaml(node.value) ?? {});
      } catch (error) {
        throw new Error(`Invalid frontmatter in ${file}: ${error}`);
      }
    }
    if (node.type === "heading") {
      items.push({
        id: `heading-${items.length}`,
        level: node.depth,
        text: textOf(node),
      });
    }
    for (const child of node.children ?? []) {
      collect(child);
    }
  }
  collect(mdast);

  // Stack-based nesting: each heading goes under the nearest preceding
  // heading with a strictly smaller level.
  /** @type {HeadingTreeNode} */
  const root = { id: "", level: 0, text: "", children: [] };
  const stack = [root];

  for (const item of items) {
    /** @type {HeadingTreeNode} */
    const node = { ...item, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return { headingTree: root, frontmatter };
}

/**
 * Depth-first search for the first h1 in a heading tree.
 *
 * @param {HeadingTreeNode[]} nodes
 * @returns {HeadingTreeNode | undefined}
 */
function findFirstH1(nodes) {
  for (const node of nodes) {
    if (node.level === 1) return node;
    const found = findFirstH1(node.children);
    if (found) return found;
  }
  return undefined;
}

/**
 * Loader entry point. The `source` of the virtual module is irrelevant — the
 * registry is derived entirely from the articles directory.
 *
 * @this {import("webpack").LoaderContext<ArticleRegistryLoaderOptions>}
 * @param {string | Buffer} _source  Unused virtual-module source.
 * @returns {Promise<string>} Generated module code.
 */
async function articleRegistryLoader(_source) {
  this.cacheable();

  const options = this.getOptions();
  const pattern = options.pattern;

  if (!pattern) {
    throw "Glob patterns must be provided.";
  }

  /** @type {string[]} */
  const files = await glob(pattern);

  // Turbopack normalizes Windows paths to `/`; keep emitted code portable.
  const filePosixList = files.map((file) => _relative(this.rootContext, file).split(sep).join("/"));
  const dates = await gitDates(filePosixList);

  /** @type {Record<string, ArticleRegistryEntry>} */
  const entries = {};

  for (const [i, file] of files.entries()) {
    const absoluteFile = resolve(this.rootContext, file);
    this.addDependency(absoluteFile);
    this.addContextDependency(dirname(absoluteFile));

    const filePosix = filePosixList[i];
    const { headingTree, frontmatter } = readArticle(absoluteFile);

    entries[filePosix] = {
      path: filePosix,
      title:
        typeof frontmatter.title === "string" && frontmatter.title
          ? frontmatter.title
          : findFirstH1(headingTree.children)?.text,
      lastModified: dates.get(filePosix) ?? null,
      frontmatter,
      headingTree,
    };
  }

  return `export default ${serialize(entries, { space: 2 })};\n`;
}

export default articleRegistryLoader;
