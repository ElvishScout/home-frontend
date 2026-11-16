import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createCssVariablesTheme } from "shiki";
import { createMdxRegistry } from "./plugins/mdx-registry";

// 代码高亮用 shiki 的 css-variables 主题：主题只输出 --shiki-* 变量引用，
// 实际色值由 app/stylesheets/globals.css 接到设计 token 上，不把配色搬进构建配置。
const shikiTheme = createCssVariablesTheme({ name: "street-pop" });

// MDX 插件必须以可序列化形式传入（字符串路径，不能是函数引用），
// 否则 Turbopack/webpack 无法把 loader options 传给 Rust 侧。
// mdx-registry loader 重建管线时只同步 remark-frontmatter / remark-gfm / rehype-slug，
// 不引入 remark-mermaid、remark-mdx-image 与 shiki——registry 只取标题与 frontmatter，
// 图表、图片与代码块着色都不影响标题集合，故无需在 loader 里同步。
const plugins = [
  createMDX({
    extension: /\.(md|mdx)$/,
    options: {
      rehypePlugins: [
        require.resolve("rehype-slug"),
        require.resolve("rehype-katex"),
        [
          require.resolve("@shikijs/rehype"),
          {
            theme: shikiTheme,
            langs: ["python"],
          },
        ],
      ],
      remarkPlugins: [
        require.resolve("remark-frontmatter"),
        require.resolve("remark-gfm"),
        require.resolve("remark-math"),
        require.resolve("./plugins/remark-mermaid.mjs"),
        require.resolve("./plugins/remark-mdx-image.mjs"),
      ],
    },
  }),
  createMdxRegistry({
    base: "./articles",
    pattern: ["./articles/**/*.{md,mdx}"],
    exclude: ["./articles/**/CLAUDE.md"],
  }),
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
