"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useIntro, useLenis } from "./providers";

const LINES = ["TRAIN", "× CREATE", "PLAY"];

export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { done, complete } = useIntro();
  const lenis = useLenis();

  // loading 期间锁定页面滚动（原生 overflow + Lenis 双保险），完成后恢复
  useEffect(() => {
    if (done) {
      document.documentElement.style.overflow = "";
      lenis?.start();
    } else {
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    }
  }, [done, lenis]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.style.display = "none";
      complete();
      return;
    }
    const lines = lineRefs.current.filter((el): el is HTMLSpanElement => el !== null);
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(lines, { y: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" })
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (pctRef.current)
                pctRef.current.textContent = `${String(Math.round(counter.v)).padStart(3, "0")}%`;
            },
          },
          0.2,
        )
        .to(lines, { y: "-110%", duration: 0.6, stagger: 0.08, ease: "power3.in" }, "+=0.15")
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }, "-=0.2")
        .set(root, { display: "none" })
        .call(complete, [], "-=0.6");
    });
    return () => ctx.revert();
  }, [complete]);

  return (
    <div ref={rootRef} className="bg-ink fixed inset-0 z-8000 flex items-center justify-center">
      <div
        ref={pctRef}
        className="font-spacemono text-fluid-6 text-acid absolute top-6 right-8 font-bold"
      >
        000%
      </div>
      <div className="text-paper">
        {LINES.map((line, i) => (
          <div key={line} className="overflow-hidden leading-95">
            <span
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`font-disp text-fluid-15 block translate-y-[110%] tracking-wide ${
                i === 1 ? "text-acid" : ""
              }`}
            >
              {line}
            </span>
          </div>
        ))}
      </div>
      <div className="font-spacemono tracking-20 text-paper/60 absolute bottom-6 left-8 text-xs">
        PORTFOLIO — 2026
      </div>
    </div>
  );
}
