import { SecHead } from "./sec-head";
import { Reveal } from "./reveal";
import { EntryList, MoreLink, type Entry } from "./entry-list";

const TRACKS: Entry[] = [
  {
    num: "TRK.01",
    title: "四和弦也能打",
    note: "LOOP · C MAJ · 92 BPM",
    meta: "01:36",
    href: "/music",
  },
  {
    num: "TRK.02",
    title: "左手先学会走路",
    note: "PRACTICE · A MIN · 76 BPM",
    meta: "02:04",
    href: "/music",
  },
  {
    num: "TRK.03",
    title: "给新番 OP 的仿写练习",
    note: "DEMO · 128 BPM",
    meta: "01:12",
    href: "/music",
  },
];

const EQ_BARS = [
  { h: "h-[40%]", bg: "bg-ink", delay: "" },
  { h: "h-[85%]", bg: "bg-scarlet", delay: "[animation-delay:150ms]" },
  { h: "h-[55%]", bg: "bg-ink", delay: "[animation-delay:300ms]" },
  { h: "h-[95%]", bg: "bg-acid", delay: "[animation-delay:450ms]" },
  { h: "h-[65%]", bg: "bg-ink", delay: "[animation-delay:600ms]" },
];

export function Music() {
  return (
    <section id="music" className="relative px-12 py-[16vh] max-md:px-6 max-md:py-[12vh]">
      <SecHead idx="04" zh="音乐" en="MUSIC WORKS" />

      <div className="grid grid-cols-12 items-stretch gap-x-10 max-lg:flex max-lg:flex-col max-lg:gap-14">
        <div className="order-2 col-span-5 flex flex-col max-lg:order-1">
          <Reveal className="max-w-xl text-fluid-7 leading-snug font-black">
            在代码与旋律之间，
            <br />
            找<em className="bg-aqua px-2 text-ink not-italic">同一种节奏</em>。
          </Reveal>
          <Reveal className="mt-8 flex items-end gap-3">
            <span aria-hidden className="flex h-9 items-end gap-1">
              {EQ_BARS.map((bar, i) => (
                <i
                  key={i}
                  className={`w-2 origin-bottom animate-eq motion-reduce:animate-none ${bar.h} ${bar.bg} ${bar.delay}`}
                />
              ))}
            </span>
            <span className="font-spacemono text-xs leading-loose tracking-14 opacity-70">
              LOOPS 12 ✦ DEMOS 3
              <br />
              BPM 76 — 128 · TARGET: ONE FULL TRACK
            </span>
          </Reveal>
          <Reveal className="mt-auto pt-4">
            <MoreLink href="/music" label="查看更多 · ALL TRACKS" />
          </Reveal>
        </div>
        <div className="order-1 col-span-7 max-lg:order-2">
          <EntryList items={TRACKS} />
        </div>
      </div>
    </section>
  );
}
