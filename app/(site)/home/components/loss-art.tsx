"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/** LOSS CURVE 视觉：进入视口后描边绘制曲线，随后标出凌晨三点的发散。 */
export function LossArt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const polyRef = useRef<SVGPolylineElement>(null);
  const spikeRefs = useRef<(SVGElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const poly = polyRef.current;
    if (!root || !poly || prefersReducedMotion()) return;
    const spikes = spikeRefs.current.filter((el): el is SVGElement => el !== null);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(poly, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" });
          gsap.to(spikes, { opacity: 1, duration: 0.4, delay: 1.5, stagger: 0.1 });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent_0_29px,rgba(242,240,233,0.13)_29px_30px),repeating-linear-gradient(90deg,transparent_0_29px,rgba(242,240,233,0.13)_29px_30px)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
        <polyline
          ref={polyRef}
          className="motion-reduce:[stroke-dashoffset:0]"
          pathLength={1}
          points="0,50 30,78 60,92 90,126 120,138 150,168 180,178 210,58 240,196 270,208 300,220 330,230 360,236 400,242"
          fill="none"
          stroke="#ffe306"
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        <circle
          ref={(el) => {
            spikeRefs.current[0] = el;
          }}
          className="opacity-0 motion-reduce:opacity-100"
          cx={210}
          cy={58}
          r={11}
          fill="#e60012"
          stroke="#111110"
          strokeWidth={3}
        />
        <text
          ref={(el) => {
            spikeRefs.current[1] = el;
          }}
          className="opacity-0 motion-reduce:opacity-100"
          x={226}
          y={48}
          fill="#e60012"
          fontFamily="Space Mono,monospace"
          fontSize={14}
          fontWeight={700}
        >
          03:00
        </text>
      </svg>
      <span className="absolute top-[8%] left-[6%] font-disp text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] tracking-[0.02em] text-transparent [-webkit-text-stroke:2px_var(--color-paper)]">
        LOSS
        <br />
        CURVE
      </span>
    </div>
  );
}
