// Placeholder module for `virtual:mdx-components`.
//
// 与 mdx-registry.stub.ts 同理：本文件只为让 Turbopack 规则有真实文件可挂。
// loader 以 mode: "components" 运行，输出 注册表 key → 懒加载文章组件 的静态映射。
// 注意：loader 生成的 import 路径以本文件所在目录（plugins/mdx-registry/）为基准，
// 移动本文件必须同步修改 loader 里的相对前缀。
export default {};
