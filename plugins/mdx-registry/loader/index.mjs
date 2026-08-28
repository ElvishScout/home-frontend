// @ts-check

import { readFileSync } from "node:fs";
import { dirname, posix, relative as _relative, resolve, sep } from "node:path";
import { createProcessor } from "@mdx-js/mdx";
import { glob } from "glob";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import serialize from "serialize-javascript";
import { parse as parseYaml } from "yaml";
import { gitDates } from "./git-date.mjs";

/**
 * @template T
 * @typedef {import("webpack").LoaderContext<T>} LoaderContext<T>
 */

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
 * Plain text of an mdast node, mirroring what the rehype side computes with
 * hast-util-to-string: only `text` and `inlineCode` become hast text nodes
 * (the latter wrapped in `<code>`), so only they contribute their `value`;
 * expressions, JSX, images and raw html contribute nothing beyond their
 * children's text.
 *
 * @param {any} node
 * @returns {string}
 */
function textOf(node) {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/**
 * Rehype plugin factory: returns a plugin that records the id and level of
 * every h1–h6 element into `out`, in the same document preorder that
 * rehype-slug's own unist-util-visit pass uses. Appended after the shared
 * rehype plugins, it harvests the ids the render pipeline actually wrote —
 * rehype-slug's real output, not a re-implementation of it.
 *
 * @param {Array<{ id: string | null, level: number }>} out
 * @returns {() => (tree: any) => void}
 */
function collectHeadingIds(out) {
  return function attacher() {
    return function transformer(tree) {
      visit(tree);
    };
  };

  /**
   * @param {any} node
   */
  function visit(node) {
    if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
      out.push({ id: node.properties?.id ?? null, level: Number(node.tagName[1]) });
    }
    for (const child of node.children ?? []) {
      visit(child);
    }
  }
}

/**
 * Parse an MDX file with the same processor the render pipeline uses
 * (@next/mdx + the plugin list mirrored in next.config.ts) and extract:
 *
 * - the heading tree: structure (nesting, level) and text come from the
 *   mdast; the ids are NOT re-implemented — the file is additionally run
 *   through remark-rehype and the real rehype plugins, and the id each
 *   rendered heading actually received is harvested back. Registry anchors
 *   therefore match the HTML by construction rather than by convention;
 * - the frontmatter: the first `---` YAML block parsed into a plain object
 *   (remark-frontmatter is registered so the block is a `yaml` node, not
 *   thematic breaks).
 *
 * @param {string} file  Absolute file path.
 * @returns {Promise<{ headingTree: HeadingTreeNode, frontmatter: Record<string, unknown> }>}
 */
async function readArticle(file) {
  const content = readFileSync(file, "utf8");

  /** @type {Array<{ id: string | null, level: number }>} */
  const renderedHeadings = [];
  // Keep in sync with the plugin list handed to @next/mdx in next.config.ts.
  const processor = createProcessor({
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [rehypeSlug, collectHeadingIds(renderedHeadings)],
  });

  // Parse twice: the first tree feeds the structural walk below, the second
  // is consumed by the remark→rehype transform (which mutates it) to let the
  // real rehype plugins assign heading ids. (createProcessor's run() is typed
  // for the full MDX-to-Program pipeline; we only ride it through rehype.)
  const mdast = processor.parse({ value: content, path: file });
  await processor.run(/** @type {any} */ (processor.parse({ value: content, path: file })));

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
      items.push({ id: "", level: node.depth, text: textOf(node) });
    }
    for (const child of node.children ?? []) {
      collect(child);
    }
  }
  collect(mdast);

  // Pair each mdast heading with the id the rehype pipeline assigned. Both
  // walks are preorder over the same heading set — JSX-written headings
  // (`<h2>…</h2>`) are invisible to both sides (mdast sees an
  // mdxJsxFlowElement; hast keeps it as a passed-through node that
  // rehype-slug's `element` visit skips) — so the two lists must line up
  // exactly. A mismatch means a plugin changed the heading set between parse
  // and render; fail the build instead of emitting wrong anchors.
  if (renderedHeadings.length !== items.length) {
    throw new Error(
      `Heading count mismatch in ${file}: the mdast has ${items.length} heading(s), ` +
        `but the rehype pipeline rendered ${renderedHeadings.length}.`,
    );
  }
  for (const [i, item] of items.entries()) {
    const rendered = renderedHeadings[i];
    if (rendered.level !== item.level || typeof rendered.id !== "string") {
      throw new Error(
        `Heading mismatch in ${file} at index ${i}: mdast has h${item.level} "${item.text}", ` +
          `but the rehype pipeline rendered h${rendered.level} with id ${JSON.stringify(rendered.id)}.`,
      );
    }
    item.id = rendered.id;
  }

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
 * Resolve a frontmatter navigation target to a registry key.
 *
 * Accepted forms:
 * - absolute: `/articles/llm/foo`（可带 `.mdx` 后缀）— 路由路径原样换算；
 * - relative: `bar.mdx`、`../baz.mdx` — 相对当前文章所在目录解析。
 *
 * @param {string} value  frontmatter 里的 prev / next 值
 * @param {string} fromKey  当前文章的 registry key（posix 相对路径）
 * @returns {string} 目标文章的 registry key
 */
function resolveNavigationKey(value, fromKey) {
  let key;
  if (value.startsWith("/")) {
    if (!value.startsWith("/articles/")) {
      throw new Error(`Invalid navigation target "${value}" in ${fromKey}: must start with /articles/`);
    }
    key = value.slice(1);
  } else {
    key = posix.join(posix.dirname(fromKey), value);
  }
  return key.endsWith(".mdx") ? key : `${key}.mdx`;
}

/**
 * Loader entry point. The `source` of the virtual module is irrelevant — the
 * registry is derived entirely from the articles directory.
 *
 * @this {LoaderContext<ArticleRegistryLoaderOptions>}
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
    const { headingTree, frontmatter } = await readArticle(absoluteFile);

    entries[filePosix] = {
      path: filePosix,
      title:
        typeof frontmatter.title === "string" && frontmatter.title
          ? frontmatter.title
          : findFirstH1(headingTree.children)?.text,
      lastModified: dates.get(filePosix) ?? null,
      frontmatter,
      headingTree,
      navigation: { prev: null, next: null },
    };
  }

  // 第二遍解析 navigation：目标必须已在 registry 里，否则构建期报错而不是留下死链。
  for (const entry of Object.values(entries)) {
    const nav = entry.frontmatter.navigation;
    if (nav === undefined || nav === null) continue;
    if (typeof nav !== "object") {
      throw new Error(`Invalid navigation in ${entry.path}: expected a mapping with prev/next`);
    }
    for (const dir of /** @type {const} */ (["prev", "next"])) {
      const value = /** @type {Record<string, unknown>} */ (nav)[dir];
      if (value === undefined || value === null) continue;
      if (typeof value !== "string" || !value) {
        throw new Error(`Invalid navigation.${dir} in ${entry.path}: expected a non-empty string`);
      }
      const target = resolveNavigationKey(value, entry.path);
      if (!entries[target]) {
        throw new Error(`Invalid navigation.${dir} in ${entry.path}: "${value}" resolves to ${target}, which is not in the registry`);
      }
      entry.navigation[dir] = target;
    }
  }

  return `export default ${serialize(entries, { space: 2 })};\n`;
}

export default articleRegistryLoader;
