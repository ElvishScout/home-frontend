"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { SmoothLink } from "./providers";

export function WorkArticle({
  index,
  even,
  art,
  artClass,
  en,
  title,
  desc,
  tags,
  linkHref = "#contact",
  linkLabel = "查看详情",
  linkExternal = false,
}: {
  index: string;
  even: boolean;
  art: ReactNode;
  artClass?: string;
  en: string;
  title: string;
  desc: string;
  tags: string[];
  linkHref?: string;
  linkLabel?: string;
  linkExternal?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    if (!root || !frame || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      /* 整卡 reveal */
      gsap.fromTo(
        root,
        { autoAlpha: 0, y: 70 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        },
      );
      /* 视觉框视差 */
      gsap.fromTo(
        frame,
        { y: 40 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={rootRef}
      className="group grid grid-cols-12 items-center gap-x-24 max-lg:flex max-lg:flex-col max-lg:items-stretch max-lg:gap-8"
    >
      <div className={`relative col-span-6 ${even ? "order-2" : ""}`}>
        <span
          className={`font-disp text-fluid-9 text-stroke-ink text-stroke-2.5 absolute -top-17.5 z-3 leading-none text-transparent ${
            even ? "-right-5" : "-left-5"
          }`}
        >
          {index}
        </span>
        <div
          ref={frameRef}
          className={`border-ink bg-ink shadow-ink-10 relative aspect-4/3 overflow-hidden border-4 ${
            even ? "rotate-[1.4deg]" : "rotate-[-1.6deg]"
          }`}
        >
          <div
            className={`ease-expo absolute inset-0 transition-transform duration-900 group-hover:scale-110 group-hover:rotate-1 ${artClass ?? ""}`}
          >
            {art}
          </div>
        </div>
      </div>
      <div
        className={`relative z-2 col-span-6 max-lg:pt-12 ${even ? "order-1 text-right max-lg:order-2 max-lg:text-left" : ""}`}
      >
        <h3 className="text-fluid-3.5 leading-tight font-black tracking-wide">
          <span className="font-disp mb-2 block text-2xl tracking-widest">{en}</span>
          {title}
        </h3>
        <p
          className={`mt-3.5 max-w-sm text-sm leading-loose opacity-75 ${even ? "ml-auto max-lg:ml-0" : ""}`}
        >
          {desc}
        </p>
        <ul
          className={`mt-4.5 flex flex-wrap gap-2.5 ${even ? "justify-end max-lg:justify-start" : ""}`}
        >
          {tags.map((tag) => (
            <li
              key={tag}
              className="border-ink bg-paper font-spacemono group-hover:bg-ink group-hover:text-acid border-2 px-3 py-1 text-xs font-bold tracking-widest transition-colors duration-300"
            >
              {tag}
            </li>
          ))}
        </ul>
        {(() => {
          const linkClass =
            "group/link relative isolate mt-6.5 inline-flex items-center gap-3 overflow-hidden py-2.5 font-spacemono text-sm font-bold tracking-16";
          const inner = (
            <>
              <span
                aria-hidden
                className="bg-acid ease-expo absolute inset-0 -z-10 transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/link:[clip-path:inset(0_0_0_0)]"
              />
              <span>{linkLabel}</span>
              <span className="ease-expo inline-block text-lg transition-transform duration-500 group-hover/link:translate-x-2.5">
                {linkExternal ? "↗" : "→"}
              </span>
            </>
          );
          return linkExternal ? (
            <a href={linkHref} target="_blank" rel="noreferrer" className={linkClass}>
              {inner}
            </a>
          ) : (
            <SmoothLink href={linkHref} className={linkClass}>
              {inner}
            </SmoothLink>
          );
        })()}
      </div>
    </article>
  );
}
