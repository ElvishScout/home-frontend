"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useLenis } from "./providers";

const SECTIONS = [
  { id: "about", num: "01" },
  { id: "projects", num: "02" },
  { id: "blog", num: "03" },
  { id: "music", num: "04" },
  { id: "skills", num: "05" },
  { id: "contact", num: "06" },
];

export function ScrollRail() {
  const lenis = useLenis();
  const markerRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!lenis) return;
    const marker = markerRef.current;
    const update = () => {
      if (!marker) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || window.pageYOffset;
      const p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
      marker.style.top = `${p * 100}%`;
      setShown(y > window.innerHeight * 0.7);
    };
    update();
    lenis.on("scroll", update);

    const ctx = gsap.context(() => {
      SECTIONS.forEach(({ id }) => {
        const sec = document.getElementById(id);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) =>
            setActive((prev) => (self.isActive ? id : prev === id ? null : prev)),
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
      className={`pointer-events-none fixed top-1/2 right-1.75 z-6000 flex h-50 -translate-y-1/2 items-stretch gap-2.5 text-white mix-blend-difference transition-opacity duration-500 ease-expo max-lg:hidden ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col justify-between font-spacemono text-[10px] font-bold tracking-[0.08em]">
        {SECTIONS.map((s) => (
          <span
            key={s.id}
            className={`transition-[opacity,transform] duration-300 ease-expo ${
              active === s.id ? "-translate-x-1 opacity-100" : "opacity-35"
            }`}
          >
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
