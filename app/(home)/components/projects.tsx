import { WorksBg } from "./works-bg";
import { WorkArticle } from "./work-article";
import { Section } from "./section";

export function Projects() {
  return (
    <Section id="projects" index="02" zh="项目" en="SELECTED PROJECT" background={<WorksBg />}>
      <div className="relative z-2 col-span-12">
        <WorkArticle
          index="01"
          even={false}
          artClass="bg-ink"
          art={
            <>
              <div
                aria-hidden
                className="absolute top-[8%] right-[7%] aspect-square w-[40%] rounded-full bg-scarlet bg-[radial-gradient(circle,var(--color-acid)_2.6px,transparent_3.2px)] bg-size-[14px_14px]"
              />
              <div
                aria-hidden
                className="absolute bottom-[4%] left-[3%] font-disp text-fluid-8xl leading-none text-transparent text-stroke-3 text-stroke-aqua"
              >
                &lt;/&gt;
              </div>
              <span
                aria-hidden
                className="absolute top-[34%] left-[12%] -rotate-3 border-3 border-ink bg-acid px-4 py-2.5 font-zh text-fluid-xl font-black text-ink shadow-hard-6 shadow-paper"
              >
                开源中 · STAR ME
              </span>
              <span className="absolute top-[8%] left-[6%] font-spacemono text-xs font-bold tracking-30 text-paper">
                STREET POP / VOL.1
              </span>
            </>
          }
          en="THIS SITE · OPEN SOURCE"
          title="主页即作品"
          desc="设计规范先行，像素随后：STREET POP 从纸面规则一路落到代码，每个区块都是一次排版实验。源码全开，GitHub 上见。"
          tags={["NEXT.JS", "GSAP", "STREET POP"]}
          linkHref="https://github.com/"
          linkLabel="源码在 GITHUB"
          external
        />
      </div>
    </Section>
  );
}
