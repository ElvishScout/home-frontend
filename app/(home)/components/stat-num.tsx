"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/** 进入视口后从 0 滚动到目标数字（两位补零）。 */
export function StatNum({ count, className }: { count: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = String(count).padStart(2, "0");
      return;
    }
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: count,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v)).padStart(2, "0");
            },
          });
        },
      });
    });
    return () => ctx.revert();
  }, [count]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
