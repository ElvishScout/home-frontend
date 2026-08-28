import { MarqueeRow } from "./marquee-row";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section id="skills" index="05" zh="技能" en="SKILLS & TOOLS" dark>
      <div className="col-span-12 -mx-12 mt-[2vh] flex flex-col gap-5.5">
        <MarqueeRow
          items={["大模型训练", "PYTORCH", "分布式", "数据处理", "实验管理"]}
          rowClassName="overflow-hidden border-y-3 border-ink bg-acid py-4 whitespace-nowrap"
          trackClassName="[animation-duration:26s]"
          itemClassName="inline-flex items-center gap-9 px-9 font-disp text-fluid-4 tracking-wider text-ink"
          starClassName="text-3xl text-scarlet"
        />
        <MarqueeRow
          items={["HTML / CSS", "JAVASCRIPT", "REACT", "GSAP", "WEB AUDIO"]}
          rowClassName="overflow-hidden border-y-3 border-paper py-4 whitespace-nowrap"
          trackClassName="[animation-direction:reverse] [animation-duration:32s]"
          itemClassName="inline-flex items-center gap-9 px-9 font-disp text-fluid-4 tracking-wider text-transparent text-stroke-paper text-stroke-1.5"
          starClassName="text-3xl text-aqua text-stroke-0"
        />
        <MarqueeRow
          items={["乐理", "和声", "编曲", "视唱练耳", "追番", "游戏"]}
          rowClassName="overflow-hidden border-y-3 border-ink bg-scarlet py-4 whitespace-nowrap"
          trackClassName="[animation-duration:26s]"
          itemClassName="inline-flex items-center gap-9 px-9 font-disp text-fluid-4 tracking-wider text-paper"
          starClassName="text-3xl text-ink"
        />
      </div>

      <Reveal className="text-fluid-3 col-span-8 leading-normal font-black">
        没上过设计课，<em className="bg-acid text-ink px-2 not-italic">审美是野路子</em>；<br />
        音乐还在学，但曲子一定会有的。
      </Reveal>

      <Reveal className="font-spacemono col-span-4 max-w-lg text-sm leading-loose tracking-wider opacity-75">
        TRAIN MODELS BY DAY
        <br />
        PIXELS &amp; MELODIES BY NIGHT
        <br />
        NEW ANIME EVERY SEASON ✦
      </Reveal>
    </Section>
  );
}
