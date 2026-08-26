"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

const SOCIALS = ["GITHUB ↗", "BEHANCE ↗", "BILIBILI ↗", "X / TWITTER ↗"];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const bigRef = useRef<HTMLHeadingElement>(null);
  const l1Ref = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      /* eyebrow / 大字 / 社交链接 reveal */
      [eyebrowRef.current, bigRef.current, socialsRef.current].forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 70 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
      /* LET'S / TALK 双向滑入 */
      gsap.from(l1Ref.current, {
        xPercent: -18,
        autoAlpha: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
      gsap.from(l2Ref.current, {
        xPercent: 18,
        autoAlpha: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-paper relative overflow-hidden px-12 py-[16vh] text-center max-md:px-6 max-md:py-[12vh]"
    >
      <span
        ref={eyebrowRef}
        className="bg-scarlet font-spacemono tracking-30 text-paper mb-[4vh] inline-block -rotate-2 px-4.5 py-1.5 text-sm font-bold"
      >
        06 / CONTACT — 聊模型、页面，还是新番？
      </span>
      <h2 ref={bigRef} className="group font-disp text-fluid-17 leading-95 select-none">
        <span ref={l1Ref} className="text-ink block">
          LET&apos;S
        </span>
        <span
          ref={l2Ref}
          className="ease-expo group-hover:text-acid text-stroke-ink text-stroke-2.5 block text-transparent transition-colors duration-500"
        >
          TALK
        </span>
      </h2>
      <a
        href="mailto:elvishscoutustc@gmail.com"
        className="group/mail border-ink bg-paper font-spacemono text-fluid-5 ease-expo shadow-ink-8 hover:shadow-ink-2 relative isolate mt-[6vh] inline-block overflow-hidden border-3 px-10 py-4 font-bold tracking-wider transition-all duration-500 hover:translate-x-1 hover:translate-y-1"
      >
        <span
          aria-hidden
          className="bg-ink ease-expo absolute inset-0 -z-10 transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/mail:[clip-path:inset(0_0_0_0)]"
        />
        <span className="group-hover/mail:text-acid relative transition-colors duration-500">
          elvishscoutustc@gmail.com
        </span>
      </a>
      <div ref={socialsRef} className="mt-[7vh] flex flex-wrap justify-center gap-2">
        {SOCIALS.map((social) => (
          <a
            key={social}
            href="#"
            className="border-ink font-spacemono tracking-14 ease-expo hover:bg-ink hover:text-aqua border-2 px-5.5 py-3 text-xs font-bold transition-colors duration-300"
          >
            {social}
          </a>
        ))}
      </div>
    </section>
  );
}
