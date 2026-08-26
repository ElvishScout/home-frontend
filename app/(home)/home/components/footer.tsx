import { MarqueeRow } from "./marquee-row";

export function Footer() {
  return (
    <footer className="bg-ink text-paper relative pb-8.5">
      <MarqueeRow
        items={["THANKS FOR SCROLLING", "感谢观看"]}
        rowClassName="overflow-hidden border-b border-paper/20 py-5.5 whitespace-nowrap"
        trackClassName="[animation-duration:30s]"
        itemClassName="inline-flex items-center gap-13.5 px-13.5 font-disp text-fluid-13 tracking-wider text-transparent [-webkit-text-stroke:1.5px_rgba(242,240,233,0.8)]"
        starClassName="text-5xl text-acid [-webkit-text-stroke:0]"
      />
      <div className="font-spacemono tracking-14 flex flex-wrap items-center justify-between gap-3.5 px-12 pt-7 text-xs opacity-70 max-md:px-6">
        <span>
          © 2026 <b className="text-acid">ELVISH SCOUT</b> — 在梯度与音符之间
        </span>
        <span>DESIGNED &amp; CO-AUTHORED BY KIMI K3</span>
      </div>
    </footer>
  );
}
