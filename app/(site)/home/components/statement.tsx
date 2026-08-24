"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

function W({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`w inline-block opacity-[0.12] ${className}`}>{children}</span>;
}

/** 关于页宣言：滚动 scrub 逐段点亮。 */
export function Statement() {
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
      className="about-statement max-w-[20em] text-[clamp(1.8rem,4.6vw,3.6rem)] leading-[1.6] font-black tracking-[0.02em]"
    >
      <W>白天训练</W>
      <W className="bg-acid px-[0.15em] text-ink box-decoration-clone">模型</W>
      <W>理解世界，晚上训练自己</W>
      <W className="bg-aqua px-[0.15em] text-ink">感受</W>
      <W>世界——用代码、用版式、用</W>
      <W className="bg-scarlet px-[0.15em] text-paper">音符</W>
      <W>。</W>
    </p>
  );
}
