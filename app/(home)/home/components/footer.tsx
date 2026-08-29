import { MarqueeBlock, MarqueeRow } from "./marquee-row";

export function Footer() {
  return (
    <footer className="bg-ink text-paper relative pb-8.5">
      <MarqueeRow className="border-paper/20 font-disp text-fluid-7 text-stroke-paper/80 text-stroke-1.5 border-b py-5.5 tracking-wider text-transparent">
        <MarqueeBlock
          className="[&>.marquee-star]:text-acid [&>.marquee-star]:text-stroke-0 gap-13.5 pr-13.5"
          items={["THANKS FOR SCROLLING", "感谢观看"]}
        />
      </MarqueeRow>
      <div className="font-spacemono tracking-14 flex flex-wrap items-center justify-between gap-3.5 px-12 pt-7 text-xs opacity-70 max-md:px-6">
        <span>
          © 2026 <b className="text-acid">ELVISH SCOUT</b> — 在梯度与音符之间
        </span>
        <span>DESIGNED &amp; CO-AUTHORED BY KIMI K3</span>
      </div>
    </footer>
  );
}
