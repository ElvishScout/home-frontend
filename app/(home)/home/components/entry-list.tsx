"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "../lib/gsap";

export type Entry = {
  num: string;
  title: string;
  note: string;
  meta: string;
  href: string;
};

/** 条目列表：滚动入视口逐行弹入；悬停时整行从左擦入强调色反色。 */
export function EntryList({ items, dark = false }: { items: Entry[]; dark?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.09,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const line = dark ? "border-paper" : "border-ink";
  const wipe = dark ? "bg-acid" : "bg-scarlet";
  const onWipe = dark ? "group-hover:text-ink" : "group-hover:text-paper";

  return (
    <ul ref={ref} className={`relative z-2 border-b-3 ${line}`}>
      {items.map((item) => (
        <li key={item.num} className={`border-t-3 ${line}`}>
          <Link
            href={item.href}
            className="group relative isolate grid grid-cols-[auto_1fr_auto] items-baseline gap-x-7 overflow-hidden px-4 py-5 max-md:gap-x-4 max-md:px-3"
          >
            <span
              aria-hidden
              className={`absolute inset-0 -z-10 ${wipe} ease-expo transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]`}
            />
            <span
              className={`font-spacemono tracking-18 pt-1 text-xs font-bold opacity-60 transition-colors duration-300 ${onWipe}`}
            >
              {item.num}
            </span>
            <span className="min-w-0">
              <span
                title={item.title}
                className={`text-fluid-3 block truncate leading-snug font-black tracking-wide transition-colors duration-300 ${onWipe}`}
              >
                {item.title}
              </span>
              <span
                className={`font-spacemono tracking-20 mt-1 block text-xs font-bold opacity-60 transition-colors duration-300 ${onWipe}`}
              >
                {item.note}
              </span>
            </span>
            <span
              className={`font-spacemono tracking-14 flex items-baseline gap-4 text-xs font-bold transition-colors duration-300 max-md:hidden ${onWipe}`}
            >
              {item.meta}
              <span
                aria-hidden
                className="ease-expo inline-block text-lg transition-transform duration-500 group-hover:translate-x-2"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** 「查看更多」按钮：直角边框 + 硬阴影，悬停擦入反色并下沉。 */
export function MoreLink({
  href,
  label,
  dark = false,
}: {
  href: string;
  label: string;
  dark?: boolean;
}) {
  const wipe = dark ? "bg-acid" : "bg-ink";
  const onWipe = dark ? "group-hover/link:text-ink" : "group-hover/link:text-paper";
  const shadow = dark
    ? "shadow-paper-6 hover:shadow-paper-2"
    : "shadow-ink-6 hover:shadow-ink-2";

  return (
    <Link
      href={href}
      className={`group/link font-spacemono tracking-16 ease-expo relative isolate inline-flex items-center gap-3 overflow-hidden border-3 border-current px-6 py-3 text-sm font-bold transition-all duration-500 hover:translate-x-1 hover:translate-y-1 ${shadow}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 ${wipe} ease-expo transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/link:[clip-path:inset(0_0_0_0)]`}
      />
      <span className={`transition-colors duration-300 ${onWipe}`}>{label}</span>
      <span
        aria-hidden
        className={`ease-expo inline-block text-lg transition-all duration-500 group-hover/link:translate-x-2 ${onWipe}`}
      >
        →
      </span>
    </Link>
  );
}
