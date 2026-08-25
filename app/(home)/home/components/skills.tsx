import { MarqueeRow } from "./marquee-row";
import { SecHead } from "./sec-head";
import { Reveal } from "./reveal";

export function Skills() {
  return (
    <section id="skills" className="relative bg-ink py-[16vh] pb-[14vh] text-paper">
      <div className="px-12 max-md:px-6">
        <SecHead idx="05" zh="技能" en="SKILLS & TOOLS" dark />
      </div>

      <div className="mt-[2vh] flex flex-col gap-5.5">
        <MarqueeRow
          items={["大模型训练", "PYTORCH", "分布式", "数据处理", "实验管理"]}
          rowClassName="overflow-hidden border-y-[3px] border-ink bg-acid py-4 whitespace-nowrap"
          trackClassName="[animation-duration:26s]"
          itemClassName="inline-flex items-center gap-[0.7em] px-[0.7em] font-disp text-[clamp(1.6rem,4vw,3.2rem)] tracking-wider text-ink"
          starClassName="text-[0.55em] text-scarlet"
        />
        <MarqueeRow
          items={["HTML / CSS", "JAVASCRIPT", "REACT", "GSAP", "WEB AUDIO"]}
          rowClassName="overflow-hidden border-y-[3px] border-paper py-4 whitespace-nowrap"
          trackClassName="[animation-direction:reverse] [animation-duration:32s]"
          itemClassName="inline-flex items-center gap-[0.7em] px-[0.7em] font-disp text-[clamp(1.6rem,4vw,3.2rem)] tracking-wider text-transparent [-webkit-text-stroke:1.5px_var(--color-paper)]"
          starClassName="text-[0.55em] text-aqua [-webkit-text-stroke:0]"
        />
        <MarqueeRow
          items={["乐理", "和声", "编曲", "视唱练耳", "追番", "游戏"]}
          rowClassName="overflow-hidden border-y-[3px] border-ink bg-scarlet py-4 whitespace-nowrap"
          trackClassName="[animation-duration:26s]"
          itemClassName="inline-flex items-center gap-[0.7em] px-[0.7em] font-disp text-[clamp(1.6rem,4vw,3.2rem)] tracking-wider text-paper"
          starClassName="text-[0.55em] text-ink"
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-7.5 px-12 pt-[8vh] max-md:px-6">
        <Reveal className="text-[clamp(1.4rem,3vw,2.2rem)] leading-normal font-black">
          没上过设计课，<em className="bg-acid px-[0.2em] text-ink not-italic">审美是野路子</em>；<br />
          音乐还在学，但曲子一定会有的。
        </Reveal>
        <Reveal className="max-w-[36em] font-spacemono text-[13px] leading-loose tracking-[0.06em] opacity-75">
          TRAIN MODELS BY DAY
          <br />
          PIXELS &amp; MELODIES BY NIGHT
          <br />
          NEW ANIME EVERY SEASON ✦
        </Reveal>
      </div>
    </section>
  );
}
