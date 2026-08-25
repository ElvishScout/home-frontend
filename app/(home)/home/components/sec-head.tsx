"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

export function SecHead({ idx, zh, en, dark = false }: { idx: string; zh: string; en: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y: 50,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="mb-[9vh] flex flex-wrap items-baseline gap-5">
      <span
        className={`inline-block -rotate-3 px-2.5 py-1 font-spacemono text-sm font-bold tracking-widest ${
          dark ? "bg-acid text-ink" : "bg-ink text-acid"
        }`}
      >
        {idx}
      </span>
      <h2 className="font-zh text-[clamp(2.4rem,7vw,5.5rem)] leading-none font-black tracking-[0.04em]">
        {zh}
        <span className="mt-[0.4em] block font-disp text-[0.42em] tracking-[0.14em] text-transparent [-webkit-text-stroke:1.5px_currentColor]">
          {en}
        </span>
      </h2>
    </div>
  );
}
