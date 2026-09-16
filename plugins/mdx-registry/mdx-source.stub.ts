// Placeholder module for `virtual:mdx-source`.
//
// 与 mdx-registry.stub.ts 同理：本文件只为让 Turbopack 规则有真实文件可挂。
// loader 以 mode: "source" 运行，输出 注册表 key → 文章原文 的映射，
// 供 /articles/source 路由在运行时直接取用（不读文件系统）。
export default {};
