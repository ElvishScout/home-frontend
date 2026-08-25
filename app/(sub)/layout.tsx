import { ReactNode } from "react";

/**
 * 子页面统一外壳（设计规范 · 子页面 §1）。
 * 只作用于 (sub) 组内的子页面（/articles、/projects、/contact…）；
 * 首页在 (home) 组，不经由本布局。页眉、页脚在此实现。
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return children;
}
