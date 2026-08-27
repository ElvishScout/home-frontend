import { ReactNode } from "react";

/** 子页面统一标题区（设计规范 · 子页面 §1）：mono 标签 + 黑体大标题 + 一行元信息。 */
export function PageHead({ tag, title, meta }: { tag: string; title: string; meta?: ReactNode }) {
  return (
    <header className="border-ink mb-14 max-md:mb-10">
      <span className="bg-ink font-spacemono tracking-20 text-acid inline-block px-2.5 py-1 text-xs font-bold">
        {tag}
      </span>
      <h1 className="font-zh text-fluid-4 mt-5 leading-none font-black tracking-wide">{title}</h1>
      {meta ? <p className="font-spacemono tracking-16 mt-4 text-xs opacity-70">{meta}</p> : null}
    </header>
  );
}
