import { ReactNode } from "react";

/** 子页面统一标题区（设计规范 · 子页面 §1）：mono 标签 + 黑体大标题 + 一行元信息。 */
export function PageHead({ tag, title, meta }: { tag: string; title: string; meta?: ReactNode }) {
  return (
    <header className="mb-14 border-ink max-md:mb-10">
      <span className="inline-block bg-ink px-2.5 py-1 font-spacemono text-xs font-bold tracking-[0.2em] text-acid">
        {tag}
      </span>
      <h1 className="mt-5 font-zh text-[clamp(2.2rem,6vw,3.5rem)] leading-none font-black tracking-[0.03em]">
        {title}
      </h1>
      {meta ? <p className="mt-4 font-spacemono text-xs tracking-[0.16em] opacity-70">{meta}</p> : null}
    </header>
  );
}
