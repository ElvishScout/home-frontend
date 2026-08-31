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
  experimental: {
    // Turbopack 的 dev 持久化缓存会把 next/font/google 生成的 CSS
    // （引用 @vercel/turbopack-next/internal/font/google/font 虚拟模块）写入 .next，
    // 重启后 import map 不再包含该虚拟模块，恢复出的缓存模块解析失败导致 500。
    // 在 Google Fonts 不可达（首次 fallback、重试后拿到真实 CSS）的网络环境下必现。
    turbopackFileSystemCacheForDev: false,
  },
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
