"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

/** works 区背景大字，随滚动横向漂移。 */
export function WorksBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const section = el.closest("section");
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      ref={ref}
      className="pointer-events-none absolute top-[6vh] right-0 left-0 z-0 overflow-hidden font-disp text-fluid-18 leading-none tracking-wide whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgba(17,17,16,0.14)]"
    >
      OPEN SOURCE ✦ 代码即态度 ✦ OPEN SOURCE
    </div>
  );
}
