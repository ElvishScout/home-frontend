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
      className="relative overflow-hidden bg-paper px-12 py-[16vh] text-center max-md:px-6 max-md:py-[12vh]"
    >
      <span
        ref={eyebrowRef}
        className="mb-[4vh] inline-block -rotate-2 bg-scarlet px-4.5 py-1.5 font-spacemono text-sm font-bold tracking-30 text-paper"
      >
        06 / CONTACT — 聊模型、页面，还是新番？
      </span>
      <h2 ref={bigRef} className="group font-disp text-fluid-8xl leading-none select-none">
        <span ref={l1Ref} className="block text-ink">
          LET&apos;S
        </span>
        <span
          ref={l2Ref}
          className="block text-transparent transition-colors duration-500 ease-expo text-stroke-2.5 text-stroke-ink group-hover:text-acid"
        >
          TALK
        </span>
      </h2>
      <a
        href="mailto:elvishscoutustc@gmail.com"
        className="group/mail wipe-ink relative isolate mt-[6vh] inline-block button-hard-8 overflow-hidden border-3 border-ink bg-paper px-8 py-3 font-spacemono text-fluid-base font-bold tracking-wider shadow-ink"
      >
        <span className="relative transition-colors duration-500 group-hover/mail:text-acid">
          elvishscoutustc@gmail.com
        </span>
      </a>
      <div ref={socialsRef} className="mt-[7vh] flex flex-wrap justify-center gap-2">
        {SOCIALS.map((social) => (
          <a
            key={social}
            href="#"
            className="border-2 border-ink px-5.5 py-3 font-spacemono text-xs font-bold tracking-14 transition-colors duration-300 ease-expo hover:bg-ink hover:text-aqua"
          >
            {social}
          </a>
        ))}
      </div>
    </section>
  );
}
