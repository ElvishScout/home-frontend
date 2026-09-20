import { MarqueeBlock, MarqueeRow } from "./marquee-row";

export function Footer() {
  return (
    <footer className="relative bg-ink pb-8.5 text-paper">
      <MarqueeRow className="border-b border-paper/20 py-5.5 font-disp text-fluid-6xl tracking-wider text-transparent text-stroke-paper/80 text-stroke-1.5">
        <MarqueeBlock
          className="gap-13.5 pr-13.5 [&>.marquee-star]:text-acid [&>.marquee-star]:text-stroke-0"
          items={["THANKS FOR SCROLLING", "感谢观看"]}
        />
      </MarqueeRow>
      <div className="flex flex-wrap items-center justify-between gap-3.5 px-12 pt-7 font-spacemono text-xs tracking-14 opacity-70 max-md:px-6">
        <span>
          © 2026 <b className="text-acid">ELVISH SCOUT</b> — 在梯度与音符之间
        </span>
        <span>DESIGNED &amp; CO-AUTHORED BY KIMI K3</span>
      </div>
    </footer>
  );
}
