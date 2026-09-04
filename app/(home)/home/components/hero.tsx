"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useIntro } from "./providers";
import { MarqueeBlock, MarqueeRow } from "./marquee-row";

/** 条码条的宽度序列（px），宽窄交替模拟真实条码。 */
const BARCODE = [3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 3];

export function Hero() {
  const { done } = useIntro();
  const ticketRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const enRef = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const clauseRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!done || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        // 票先蹦进来（从更斜的角度回正到 -1.5°）
        .from(ticketRef.current, {
          y: 90,
          rotate: -9,
          duration: 0.9,
          ease: "back.out(1.2)",
        })
        .from(
          charRefs.current.filter(Boolean),
          {
            yPercent: 115,
            rotate: 6,
            duration: 0.9,
            stagger: 0.06,
            ease: "power4.out",
          },
          "-=0.45",
        )
        .from(
          enRef.current,
          { xPercent: -12, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.7",
        )
        .from(
          tagRef.current,
          { scale: 0, rotate: -14, duration: 0.6, ease: "back.out(2.2)" },
          "-=0.5",
        )
        // 启程章"啪"地盖上
        .from(
          stampRef.current,
          { scale: 0, rotate: 40, duration: 0.7, ease: "back.out(2.5)" },
          "-=0.35",
        )
        // 条码逐条刷出
        .from(
          barRef.current?.children ?? [],
          {
            scaleX: 0,
            transformOrigin: "left center",
            stagger: 0.02,
            duration: 0.25,
          },
          "-=0.4",
        )
        .from(
          [eyebrowRef.current, lineRef.current, clauseRef.current, hintRef.current],
          { opacity: 0, y: 16, stagger: 0.08, duration: 0.5 },
          "-=0.5",
        )
        .from(marqueeRef.current, { yPercent: 100, duration: 0.6, ease: "power3.out" }, "-=0.3");
    });
    return () => ctx.revert();
  }, [done]);

  return (
    <>
      <header id="top" className="bg-paper overflow-hidden px-12 max-md:px-6">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-[4vh] pt-22 pb-12 max-md:pt-20 max-md:pb-10">
          <p
            ref={eyebrowRef}
            className="font-spacemono tracking-24 flex items-center gap-3.5 text-xs font-bold"
          >
            <span aria-hidden className="bg-ink h-0.5 w-12" />
            个人主页 / PORTFOLIO — 2026
          </p>

          {/* ---------- 演出票 ---------- */}
          <div ref={ticketRef} className="relative rotate-[-1.5deg] will-change-transform">
            <div className="border-ink bg-paper shadow-ink-10 grid border-3 md:grid-cols-[1fr_15rem]">
              {/* 票面 */}
              <div className="relative p-7 max-md:p-5">
                <div className="font-spacemono tracking-24 border-ink text-2xs max-md:tracking-14 flex items-center justify-between border-b-2 pb-3 font-bold md:mr-40">
                  <span>ADMIT ONE</span>
                  <span>2026 ★ 就此启程</span>
                </div>
                <h1 className="leading-tighter mt-5 select-none">
                  <div className="overflow-hidden py-1.5">
                    <span className="font-disp text-fluid-7xl inline-block font-black tracking-wide will-change-transform">
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
                      className="font-disp text-fluid-6xl text-stroke-ink text-stroke-2.5 ml-[10%] inline-block text-transparent will-change-transform"
                    >
                      SCOUT
                    </span>
                  </div>
                </h1>
                <span
                  ref={tagRef}
                  className="border-ink bg-acid text-fluid-base tracking-14 shadow-ink-6 mt-5 inline-block border-3 px-5 py-2 font-black"
                >
                  随身携带：模型 · 页面 · 音符
                </span>
                <p
                  ref={lineRef}
                  className="font-spacemono tracking-16 border-ink mt-6 border-t-2 pt-3 text-xs font-bold max-md:mt-5 md:mr-40"
                >
                  <span>
                    旅程即将开启，敬请期待
                    <br />
                    THE JOURNEY IS ABOUT TO BEGIN
                  </span>
                </p>

                {/* 票面右侧：竖排条款大字，票面专属的"概不退换" */}
                <div
                  ref={clauseRef}
                  aria-hidden
                  className="absolute top-1/2 right-7 flex -translate-y-1/2 items-center gap-3 max-md:hidden"
                >
                  <span className="font-disp text-fluid-4xl text-stroke-ink text-stroke-2 leading-none text-transparent [writing-mode:vertical-rl]">
                    NO REFUND
                  </span>
                  <span className="font-spacemono text-2xs tracking-24 font-bold [writing-mode:vertical-rl]">
                    概不退换 ★
                  </span>
                </div>
              </div>

              {/* 票根 */}
              <div className="border-ink relative flex items-center justify-between gap-6 border-dashed p-6 max-md:border-t-3 md:flex-col md:border-l-3 md:py-8">
                {/* 打孔缺口：桌面在打孔线两端，移动端在左右两侧 */}
                <i
                  aria-hidden
                  className="bg-paper border-ink absolute -top-4 -left-4 z-2 h-7 w-7 rounded-full border-3 max-md:hidden"
                />
                <i
                  aria-hidden
                  className="bg-paper border-ink absolute -bottom-4 -left-4 z-2 h-7 w-7 rounded-full border-3 max-md:hidden"
                />
                <i
                  aria-hidden
                  className="bg-paper border-ink absolute -top-4 -left-4 z-2 h-7 w-7 rounded-full border-3 md:hidden"
                />
                <i
                  aria-hidden
                  className="bg-paper border-ink absolute -top-4 -right-4 z-2 h-7 w-7 rounded-full border-3 md:hidden"
                />

                <span className="font-spacemono tracking-24 text-xs font-bold whitespace-nowrap">
                  N°0901
                </span>
                <span className="font-zh tracking-14 text-lg font-black whitespace-nowrap md:[writing-mode:vertical-rl]">
                  保持训练。
                </span>
                <div className="flex flex-col items-center gap-2 max-md:flex-1">
                  <div ref={barRef} className="flex h-12 items-stretch gap-px max-md:h-8">
                    {BARCODE.map((w, i) => (
                      <i key={i} className="bg-ink block h-full" style={{ width: w }} />
                    ))}
                  </div>
                  <span className="font-spacemono text-3xs tracking-24 font-bold">0901·2026</span>
                </div>
              </div>
            </div>

            {/* 启程章：斜跨票面右下角 */}
            <div
              ref={stampRef}
              className="border-scarlet text-scarlet bg-paper font-zh tracking-14 absolute -right-4 -bottom-5 z-3 rotate-[2.5deg] border-4 border-double px-3 py-1.5 text-sm font-black max-md:-right-2"
            >
              已启程
            </div>
          </div>

          <div ref={hintRef} className="flex justify-end">
            <div className="font-spacemono tracking-30 flex items-center gap-2.5 text-xs font-bold">
              SCROLL <span className="animate-bob inline-block">↓</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={marqueeRef}>
        <MarqueeRow className="border-ink bg-acid z-3 border-y-3 py-3.5">
          <MarqueeBlock
            className="font-disp text-fluid-xl gap-6.5 pr-6.5 tracking-wider"
            items={["TRAIN", "CREATE", "PLAY", "模型", "页面", "音符"]}
          />
        </MarqueeRow>
      </div>
    </>
  );
}
