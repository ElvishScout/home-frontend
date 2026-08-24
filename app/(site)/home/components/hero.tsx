"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useIntro } from "./providers";
import { MarqueeRow } from "./marquee-row";

const TITLE_ZH = "林一";

export function Hero() {
  const { done } = useIntro();
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const enRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!done || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(
          charRefs.current.filter(Boolean),
          { yPercent: 115, rotate: 6, duration: 0.9, stagger: 0.06, ease: "power4.out" },
        )
        .from(enRef.current, { xPercent: -12, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .from(eyebrowRef.current, { opacity: 0, x: -30, duration: 0.6 }, "-=0.6")
        .from(roleRef.current, { scale: 0, rotate: -14, duration: 0.7, ease: "back.out(2.2)" }, "-=0.4")
        .from(stickerRef.current, { scale: 0, rotate: 90, duration: 0.8, ease: "back.out(2.5)" }, "-=0.5")
        .from(
          [metaRef.current, sideRef.current, hintRef.current],
          { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 },
          "-=0.8",
        )
        .from(marqueeRef.current, { yPercent: 100, duration: 0.6, ease: "power3.out" }, "-=0.4");
    });
    return () => ctx.revert();
  }, [done]);

  return (
    <>
      <header
        id="top"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-paper px-12 pt-28 pb-24 max-md:px-6 max-md:pt-25 max-md:pb-22.5"
      >
        <div className="relative z-2">
          <p
            ref={eyebrowRef}
            className="mb-[3vh] flex items-center gap-3.5 font-spacemono text-xs font-bold tracking-[0.24em]"
          >
            <span aria-hidden className="h-0.5 w-12 bg-ink" />
            个人主页 / PORTFOLIO — 2026
          </p>
          <h1 className="leading-[0.92] select-none">
            <div className="overflow-hidden py-[0.04em]">
              <span className="inline-block font-zh text-[clamp(4.5rem,17vw,15rem)] font-black tracking-[0.02em] will-change-transform">
                {TITLE_ZH.split("").map((ch, i) => (
                  <span key={ch} className="inline-block overflow-hidden align-bottom">
                    <span
                      ref={(el) => {
                        charRefs.current[i] = el;
                      }}
                      className="inline-block"
                    >
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </div>
            <div className="overflow-hidden py-[0.04em]">
              <span
                ref={enRef}
                className="ml-[8vw] inline-block font-disp text-[clamp(3.2rem,12vw,10.5rem)] tracking-[0.01em] text-transparent [-webkit-text-stroke:2.5px_var(--color-ink)] will-change-transform max-md:ml-[4vw]"
              >
                LIN&nbsp;YI
              </span>
            </div>
          </h1>
          <div>
            <span
              ref={roleRef}
              className="mt-[3.5vh] inline-block -rotate-2 border-[3px] border-ink bg-acid px-6 py-2.5 text-[clamp(1rem,2.6vw,1.7rem)] font-black tracking-[0.14em] shadow-[6px_6px_0_0_var(--color-ink)]"
            >
              大模型训练 × 创意前端
            </span>
          </div>
        </div>

        <div
          ref={stickerRef}
          className="absolute top-[16%] right-[15vw] z-3 flex aspect-square w-[clamp(110px,13vw,180px)] rotate-[2.5deg] items-center justify-center border-[3px] border-ink bg-scarlet shadow-[10px_10px_0_0_var(--color-ink)] max-md:top-[10%] max-md:right-4"
        >
          <div aria-hidden className="absolute inset-0 -z-10 translate-x-4.5 translate-y-4.5 border-[3px] border-ink" />
          <span className="relative text-center font-spacemono text-[clamp(11px,1.2vw,14px)] leading-normal font-bold text-paper">
            KEEP
            <br />
            TRAIN-
            <br />
            ING
          </span>
        </div>

        <aside
          ref={sideRef}
          className="absolute top-1/2 right-12 z-2 -translate-y-1/2 border-l-2 border-ink pl-3.5 text-[clamp(1rem,2vw,1.4rem)] font-black tracking-[0.5em] [writing-mode:vertical-rl] max-md:hidden"
        >
          练习即正义
        </aside>

        <div className="relative z-2 mt-auto flex items-end justify-between gap-6 pt-[6vh]">
          <div ref={metaRef} className="font-spacemono text-xs leading-loose tracking-[0.08em] max-md:text-[11px]">
            <b className="bg-ink px-1.5 py-px text-acid">DAY</b>
            {" "}训练大模型
            <br />
            <b className="bg-ink px-1.5 py-px text-acid">NIGHT</b>
            {" "}前端 · 设计自学 · 当季新番
            <br />
            <b className="bg-ink px-1.5 py-px text-acid">STATUS</b>
            {" "}音乐练习中{" "}
            <span className="inline-flex h-3.5 items-end gap-0.75 align-[-2px]">
              <i className="eq-bar h-[40%] w-1 origin-bottom animate-eq border border-ink bg-acid [animation-duration:0.9s]" />
              <i className="eq-bar h-[92%] w-1 origin-bottom animate-eq border border-ink bg-acid [animation-delay:150ms] [animation-duration:0.9s]" />
              <i className="eq-bar h-[58%] w-1 origin-bottom animate-eq border border-ink bg-acid [animation-delay:300ms] [animation-duration:0.9s]" />
              <i className="eq-bar h-full w-1 origin-bottom animate-eq border border-ink bg-acid [animation-delay:450ms] [animation-duration:0.9s]" />
            </span>
          </div>
          <div ref={hintRef} className="flex items-center gap-2.5 font-spacemono text-[11px] font-bold tracking-[0.3em]">
            SCROLL <span className="inline-block animate-bob">↓</span>
          </div>
        </div>
      </header>

      <div ref={marqueeRef}>
        <MarqueeRow
          items={["TRAIN", "CREATE", "PLAY", "模型", "页面", "音符"]}
          rowClassName="relative z-3 overflow-hidden border-y-[3px] border-ink bg-acid py-3.5 whitespace-nowrap"
          itemClassName="inline-flex items-center gap-[0.8em] px-[0.8em] font-disp text-[clamp(1.2rem,2.6vw,2rem)] tracking-[0.06em]"
          starClassName="text-[0.7em]"
        />
      </div>
    </>
  );
}
