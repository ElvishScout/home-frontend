import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createMdxRegistry } from "./plugins/mdx-registry";

// MDX 插件必须以可序列化形式传入（字符串路径，不能是函数引用），
// 否则 Turbopack/webpack 无法把 loader options 传给 Rust 侧。
const plugins = [
  createMDX({
    extension: /\.(md|mdx)$/,
    options: {
      rehypePlugins: [require.resolve("./plugins/rehype-heading-ids.mjs")],
      remarkPlugins: [require.resolve("remark-frontmatter"), require.resolve("remark-gfm")],
    },
  }),
  createMdxRegistry({ pattern: ["./articles/**/*.mdx"] }),
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
