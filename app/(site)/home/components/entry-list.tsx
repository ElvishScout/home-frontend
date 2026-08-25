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
    <ul ref={ref} className={`relative z-2 border-b-[3px] ${line}`}>
      {items.map((item) => (
        <li key={item.num} className={`border-t-[3px] ${line}`}>
          <Link
            href={item.href}
            className="group relative isolate grid grid-cols-[auto_1fr_auto] items-baseline gap-x-7 overflow-hidden px-4 py-5 max-md:gap-x-4 max-md:px-3"
          >
            <span
              aria-hidden
              className={`absolute inset-0 -z-10 ${wipe} [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-expo group-hover:[clip-path:inset(0_0_0_0)]`}
            />
            <span
              className={`pt-[0.3em] font-spacemono text-xs font-bold tracking-[0.18em] opacity-60 transition-colors duration-300 ${onWipe}`}
            >
              {item.num}
            </span>
            <span className="min-w-0">
              <span
                title={item.title}
                className={`block truncate text-[clamp(1.15rem,2.2vw,1.7rem)] leading-snug font-black tracking-[0.02em] transition-colors duration-300 ${onWipe}`}
              >
                {item.title}
              </span>
              <span
                className={`mt-1 block font-spacemono text-[11px] font-bold tracking-[0.2em] opacity-60 transition-colors duration-300 ${onWipe}`}
              >
                {item.note}
              </span>
            </span>
            <span
              className={`flex items-baseline gap-4 font-spacemono text-xs font-bold tracking-[0.14em] transition-colors duration-300 max-md:hidden ${onWipe}`}
            >
              {item.meta}
              <span
                aria-hidden
                className="inline-block text-lg transition-transform duration-500 ease-expo group-hover:translate-x-2"
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
export function MoreLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  const wipe = dark ? "bg-acid" : "bg-ink";
  const onWipe = dark ? "group-hover/link:text-ink" : "group-hover/link:text-paper";
  const shadow = dark
    ? "shadow-[6px_6px_0_0_var(--color-paper)] hover:shadow-[2px_2px_0_0_var(--color-paper)]"
    : "shadow-[6px_6px_0_0_var(--color-ink)] hover:shadow-[2px_2px_0_0_var(--color-ink)]";

  return (
    <Link
      href={href}
      className={`group/link relative isolate inline-flex items-center gap-3 overflow-hidden border-[3px] border-current px-6 py-3 font-spacemono text-[13px] font-bold tracking-[0.16em] transition-all duration-500 ease-expo hover:translate-x-1 hover:translate-y-1 ${shadow}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 ${wipe} [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-expo group-hover/link:[clip-path:inset(0_0_0_0)]`}
      />
      <span className={`transition-colors duration-300 ${onWipe}`}>{label}</span>
      <span
        aria-hidden
        className={`inline-block text-lg transition-all duration-500 ease-expo group-hover/link:translate-x-2 ${onWipe}`}
      >
        →
      </span>
    </Link>
  );
}
