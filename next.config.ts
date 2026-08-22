import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createMdxRegistry } from "./plugins/mdx-registry";

const plugins = [
  createMDX({
    extension: /\.(md|mdx)$/,
    options: {
      rehypePlugins: [require.resolve("./plugins/rehype-heading-ids.mjs")],
    },
  }),
  createMdxRegistry({ pattern: ["./articles/**/*.mdx"] }),
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default plugins.reduce((config, plugin) => plugin(config), nextConfig);
