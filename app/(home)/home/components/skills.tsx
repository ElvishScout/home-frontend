import { MarqueeBlock, MarqueeRow } from "./marquee-row";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section id="skills" index="05" zh="技能" en="SKILLS & TOOLS" dark>
      <div className="col-span-12 mt-[2vh] flex justify-center">
        <div className="mx-[-50%] flex w-screen flex-col gap-2">
          <MarqueeRow className="border-ink font-disp text-fluid-4 text-ink bg-acid rotate-[0.75deg] border-y-3 py-4 tracking-wider">
            <MarqueeBlock
              className="[&>.marquee-star]:text-scarlet gap-9 pr-9"
              items={["大模型训练", "PYTORCH", "分布式", "数据处理", "实验管理"]}
            />
          </MarqueeRow>
          <MarqueeRow
            className="border-paper bg-ink font-disp text-fluid-4 text-stroke-paper text-stroke-1.5 rotate-[-0.75deg] border-y-3 py-4 tracking-wider text-transparent"
            reverse
          >
            <MarqueeBlock
              className="[&>.marquee-star]:text-aqua [&>.marquee-star]:text-stroke-0 gap-9 pr-9"
              items={["HTML / CSS", "JAVASCRIPT", "REACT", "GSAP", "WEB AUDIO"]}
            />
          </MarqueeRow>
          <MarqueeRow className="border-ink bg-scarlet font-disp text-fluid-4 text-paper rotate-[0.75deg] border-y-3 py-4 tracking-wider">
            <MarqueeBlock
              className="[&>.marquee-star]:text-ink [&>.marquee-star]:text-stroke-0 gap-9 pr-9"
              items={["乐理", "和声", "编曲", "视唱练耳", "追番", "游戏"]}
            />
          </MarqueeRow>
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
