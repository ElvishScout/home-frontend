"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useIntro } from "./providers";
import { MarqueeRow } from "./marquee-row";

function HeroMeta({
  className = "",
  refProp,
}: {
  className?: string;
  refProp?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={refProp}
      className={`font-spacemono text-base leading-loose tracking-widest max-md:text-sm ${className}`}
    >
      <b className="bg-ink text-acid px-1.5 py-px">DAY</b> 训练大模型
      <br />
      <b className="bg-ink text-acid px-1.5 py-px">NIGHT</b> 前端 · 设计自学 · 当季新番
      <br />
      <b className="bg-ink text-acid px-1.5 py-px">STATUS</b> 音乐练习中{" "}
      <span className="inline-flex h-3.5 items-end gap-0.75 align-[-2px]">
        <i className="animate-eq border-ink bg-acid h-[40%] w-1 origin-bottom border [animation-duration:0.9s] motion-reduce:animate-none" />
        <i className="animate-eq border-ink bg-acid h-[92%] w-1 origin-bottom border [animation-delay:150ms] [animation-duration:0.9s] motion-reduce:animate-none" />
        <i className="animate-eq border-ink bg-acid h-[58%] w-1 origin-bottom border [animation-delay:300ms] [animation-duration:0.9s] motion-reduce:animate-none" />
        <i className="animate-eq border-ink bg-acid h-full w-1 origin-bottom border [animation-delay:450ms] [animation-duration:0.9s] motion-reduce:animate-none" />
      </span>
    </div>
  );
}

export function Hero() {
  const { done } = useIntro();
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const enRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!done || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(charRefs.current.filter(Boolean), {
          yPercent: 115,
          rotate: 6,
          duration: 0.9,
          stagger: 0.06,
          ease: "power4.out",
        })
        .from(
          enRef.current,
          { xPercent: -12, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.7",
        )
        .from(eyebrowRef.current, { opacity: 0, x: -30, duration: 0.6 }, "-=0.6")
        .from(
          roleRef.current,
          { scale: 0, rotate: -14, duration: 0.7, ease: "back.out(2.2)" },
          "-=0.4",
        )
        .from(
          stickerRef.current,
          { scale: 0, rotate: 90, duration: 0.8, ease: "back.out(2.5)" },
          "-=0.5",
        )
        .from(
          [metaRef.current, hintRef.current],
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
        className="bg-paper relative flex min-h-screen flex-col justify-center overflow-hidden px-12 pt-28 pb-24 max-md:px-6 max-md:pt-25 max-md:pb-22.5"
      >
        <div className="relative z-2">
          <p
            ref={eyebrowRef}
            className="font-spacemono tracking-24 mb-[6vh] flex items-center gap-3.5 text-xs font-bold"
          >
            <span aria-hidden className="bg-ink h-0.5 w-12" />
            个人主页 / PORTFOLIO — 2026
          </p>
          <h1 className="leading-92 select-none">
            <div className="overflow-hidden py-1.5">
              <span className="font-disp text-fluid-16 inline-block font-black tracking-wide will-change-transform">
                {"ELVISH".split("").map((ch, i) => (
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
            <div className="overflow-hidden py-1.5">
              <span
                ref={enRef}
                className="font-disp text-fluid-15 ml-[4vw] inline-block text-transparent will-change-transform [-webkit-text-stroke:2.5px_var(--color-ink)] max-md:ml-[4vw]"
              >
                SCOUT
              </span>
            </div>
          </h1>
          <div>
            <span
              ref={roleRef}
              className="border-ink bg-acid text-fluid-5 tracking-14 mt-[4vh] inline-block -rotate-2 border-3 px-6 py-2.5 font-black shadow-[6px_6px_0_0_var(--color-ink)]"
            >
              大模型训练 × 创意前端
            </span>
          </div>
        </div>

        <div className="absolute top-[20%] right-16 z-3 flex flex-col items-start gap-20 max-md:top-[16%] max-md:right-10">
          <div
            ref={stickerRef}
            className="border-ink bg-scarlet relative flex aspect-square w-[clamp(110px,13vw,180px)] rotate-[2.5deg] items-center justify-center border-3 shadow-[10px_10px_0_0_var(--color-ink)]"
          >
            <div
              aria-hidden
              className="border-ink absolute inset-0 -z-10 translate-x-4.5 translate-y-4.5 border-3"
            />
            <span className="font-spacemono text-fluid-1 text-paper relative text-center leading-normal font-bold">
              KEEP
              <br />
              TRAIN-
              <br />
              ING
            </span>
          </div>
          <HeroMeta refProp={metaRef} className="max-md:hidden" />
        </div>

        <div className="relative z-2 mt-auto flex flex-col justify-between gap-12 pt-[6vh] md:justify-end">
          <HeroMeta className="md:hidden" />
          <div
            ref={hintRef}
            className="font-spacemono tracking-30 flex items-center justify-end gap-2.5 text-xs font-bold"
          >
            SCROLL <span className="animate-bob inline-block">↓</span>
          </div>
        </div>
      </header>

      <div ref={marqueeRef}>
        <MarqueeRow
          items={["TRAIN", "CREATE", "PLAY", "模型", "页面", "音符"]}
          rowClassName="relative z-3 overflow-hidden border-y-3 border-ink bg-acid py-3.5 whitespace-nowrap"
          itemClassName="inline-flex items-center gap-6.5 px-6.5 font-disp text-fluid-5 tracking-wider"
          starClassName="text-2xl"
        />
      </div>
    </>
  );
}
