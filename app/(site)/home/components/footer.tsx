import { MarqueeRow } from "./marquee-row";

export function Footer() {
  return (
    <footer className="relative bg-ink pb-8.5 text-paper">
      <MarqueeRow
        items={["THANKS FOR SCROLLING", "感谢观看"]}
        rowClassName="overflow-hidden border-b border-paper/20 py-[22px] whitespace-nowrap"
        trackClassName="[animation-duration:30s]"
        itemClassName="inline-flex items-center gap-[0.6em] px-[0.6em] font-disp text-[clamp(2.4rem,7vw,5.6rem)] tracking-[0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(242,240,233,0.8)]"
        starClassName="text-[0.5em] text-acid [-webkit-text-stroke:0]"
      />
      <div className="flex flex-wrap items-center justify-between gap-3.5 px-12 pt-7 font-spacemono text-[11px] tracking-[0.14em] opacity-70 max-md:px-6">
        <span>
          © 2026 <b className="text-acid">LIN YI</b> — 在梯度与音符之间
        </span>
        <span>DESIGNED &amp; CODED BY HAND ✦ NO TEMPLATE</span>
      </div>
    </footer>
  );
}
