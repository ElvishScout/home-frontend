"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

function W({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block opacity-[0.12] motion-reduce:opacity-100 ${className}`}>
      {children}
    </span>
  );
}

/** 关于页宣言：滚动 scrub 逐段点亮。 */
export function Statement({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(Array.from(el.children), {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 25%", scrub: 0.6 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <p
      ref={ref}
      className={`text-fluid-4xl max-w-6xl leading-relaxed font-black tracking-wide ${className}`}
    >
      <W>模型、页面、曲子，</W>
      <W>看起来是三件事，</W>
      <W className="bg-acid text-ink box-decoration-clone px-2">做到底是同一件事</W>
      <W>——把想法变成</W>
      <W className="bg-scarlet text-paper px-2">能跑的东西</W>
      <W>。</W>
    </p>
  );
}
