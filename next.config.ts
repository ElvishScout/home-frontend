import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createMdxRegistry } from "./plugins/mdx-registry";

// MDX 插件必须以可序列化形式传入（字符串路径，不能是函数引用），
// 否则 Turbopack/webpack 无法把 loader options 传给 Rust 侧。
// mdx-registry loader 重建管线时只同步 remark-frontmatter / remark-gfm / rehype-slug，
// 不引入 remark-mermaid——registry 只取标题与 frontmatter，代码块改写与它无关。
const plugins = [
  createMDX({
    extension: /\.(md|mdx)$/,
    options: {
      rehypePlugins: [require.resolve("rehype-slug")],
      remarkPlugins: [
        require.resolve("remark-frontmatter"),
        require.resolve("remark-gfm"),
        require.resolve("./plugins/remark-mermaid.mjs"),
      ],
    },
  }),
  createMdxRegistry({ pattern: ["./articles/**/*.{md,mdx}"] }),
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
