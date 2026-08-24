"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useLenis } from "./providers";

const SECTIONS = [
  { id: "about", num: "01" },
  { id: "works", num: "02" },
  { id: "skills", num: "03" },
  { id: "contact", num: "04" },
];

export function ScrollRail() {
  const lenis = useLenis();
  const railRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLElement>(null);
  const numsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lenis) return;
    const marker = markerRef.current;
    const rail = railRef.current;
    const update = () => {
      if (!marker) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || window.pageYOffset;
      const p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
      marker.style.top = `${p * 100}%`;
      rail?.classList.toggle("show", y > window.innerHeight * 0.7);
    };
    update();
    lenis.on("scroll", update);

    const ctx = gsap.context(() => {
      if (!numsRef.current) return;
      Array.from(numsRef.current.children).forEach((n) => {
        const secId = n.getAttribute("data-rail");
        const sec = secId ? document.getElementById(secId) : null;
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => n.classList.toggle("on", self.isActive),
        });
      });
    });

    return () => {
      ctx.revert();
      lenis.off("scroll", update);
    };
  }, [lenis]);

  return (
    <aside
      aria-hidden
      ref={railRef}
      className="rail pointer-events-none fixed top-1/2 right-1.75 z-6000 flex h-50 -translate-y-1/2 items-stretch gap-2.5 text-white mix-blend-difference max-lg:hidden"
    >
      <div ref={numsRef} className="rail-nums flex flex-col justify-between font-spacemono text-[10px] font-bold tracking-[0.08em]">
        {SECTIONS.map((s) => (
          <span key={s.id} data-rail={s.id}>
            {s.num}
          </span>
        ))}
      </div>
      <div className="relative w-0.5 bg-white/30">
        <i ref={markerRef} className="absolute top-0 left-1/2 size-2.25 -translate-x-1/2 bg-white" />
      </div>
    </aside>
  );
}
