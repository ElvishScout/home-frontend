import { MarqueeRow } from "./marquee-row";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section id="skills" index="05" zh="技能" en="SKILLS & TOOLS" dark>
      <div className="col-span-12 mt-[2vh] flex justify-center">
        <div className="mx-[-50%] flex w-screen flex-col gap-2">
          <MarqueeRow
            items={["大模型训练", "PYTORCH", "分布式", "数据处理", "实验管理"]}
            rowClassName="border-ink bg-acid rotate-1 overflow-hidden border-y-3 py-4 whitespace-nowrap"
            itemClassName="font-disp text-fluid-4 text-ink inline-flex items-center gap-9 px-9 tracking-wider"
            starClassName="text-scarlet text-3xl"
          />
          <MarqueeRow
            items={["HTML / CSS", "JAVASCRIPT", "REACT", "GSAP", "WEB AUDIO"]}
            rowClassName="border-paper bg-ink -rotate-1 overflow-hidden border-y-3 py-4 whitespace-nowrap"
            trackClassName="[animation-direction:reverse]"
            itemClassName="font-disp text-fluid-4 text-stroke-paper text-stroke-1.5 inline-flex items-center gap-9 px-9 tracking-wider text-transparent"
            starClassName="text-aqua text-stroke-0 text-3xl"
          />
          <MarqueeRow
            items={["乐理", "和声", "编曲", "视唱练耳", "追番", "游戏"]}
            rowClassName="border-ink bg-scarlet rotate-1 overflow-hidden border-y-3 py-4 whitespace-nowrap"
            itemClassName="font-disp text-fluid-4 text-paper inline-flex items-center gap-9 px-9 tracking-wider"
            starClassName="text-ink text-3xl"
          />
        </div>
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
