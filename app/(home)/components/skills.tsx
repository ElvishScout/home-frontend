import { MarqueeBlock, MarqueeRow } from "./marquee-row";
import { Reveal } from "./reveal";
import { Section } from "./section";

export function Skills() {
  return (
    <Section id="skills" index="05" zh="技能" en="SKILLS & TOOLS" dark>
      <div className="col-span-12 mt-[2vh] flex justify-center">
        <div className="mx-[-50%] flex w-screen flex-col gap-2">
          <MarqueeRow className="rotate-fluid-4 border-y-3 border-ink bg-acid py-4 font-disp text-fluid-3xl tracking-wider text-ink">
            <MarqueeBlock
              className="gap-9 pr-9 [&>.marquee-star]:text-scarlet"
              items={["大模型训练", "PYTORCH", "分布式", "数据处理", "实验管理"]}
            />
          </MarqueeRow>
          <MarqueeRow
            className="-rotate-fluid-4 border-y-3 border-paper bg-ink py-4 font-disp text-fluid-3xl tracking-wider text-transparent text-stroke-1.5 text-stroke-paper"
            reverse
          >
            <MarqueeBlock
              className="gap-9 pr-9 [&>.marquee-star]:text-aqua [&>.marquee-star]:text-stroke-0"
              items={["HTML / CSS", "JAVASCRIPT", "REACT", "GSAP", "WEB AUDIO"]}
            />
          </MarqueeRow>
          <MarqueeRow className="rotate-fluid-4 border-y-3 border-ink bg-scarlet py-4 font-disp text-fluid-3xl tracking-wider text-paper">
            <MarqueeBlock
              className="gap-9 pr-9 [&>.marquee-star]:text-ink [&>.marquee-star]:text-stroke-0"
              items={["乐理", "和声", "编曲", "视唱练耳", "追番", "游戏"]}
            />
          </MarqueeRow>
        </div>
      </div>

      <Reveal className="col-span-8 text-fluid-2xl leading-normal font-black">
        技能清单谁都会写，
        <br />
        <em className="bg-acid px-2 text-ink not-italic">交过账的才算</em>。
      </Reveal>

      <Reveal className="col-span-4 max-w-lg font-spacemono text-sm leading-loose tracking-wider opacity-75">
        TRAIN MODELS BY DAY
        <br />
        PIXELS &amp; MELODIES BY NIGHT
        <br />
        NEW ANIME EVERY SEASON ✦
      </Reveal>
    </Section>
  );
}
