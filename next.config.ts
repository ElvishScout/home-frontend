import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createMdxRegistry } from "./plugins/mdx-registry";

// MDX 插件必须以可序列化形式传入（字符串路径，不能是函数引用），
// 否则 Turbopack/webpack 无法把 loader options 传给 Rust 侧。
// mdx-registry loader 直接导入同一批插件包重建这条管线，两份清单需保持同步。
const plugins = [
  createMDX({
    extension: /\.(md|mdx)$/,
    options: {
      rehypePlugins: [require.resolve("rehype-slug")],
      remarkPlugins: [require.resolve("remark-frontmatter"), require.resolve("remark-gfm")],
    },
  }),
  createMdxRegistry({ pattern: ["./articles/**/*.mdx"] }),
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
