declare module "virtual:mdx-source" {
  /** 注册表 key → 文章原文（构建期内嵌）；key 集合与 virtual:mdx-registry 完全一致 */
  const sources: Record<string, string>;
  export default sources;
}
