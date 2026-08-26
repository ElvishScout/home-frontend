import { SecHead } from "./sec-head";
import { WorksBg } from "./works-bg";
import { WorkArticle } from "./work-article";

export function Projects() {
  return (
    <section id="projects" className="relative px-12 py-[16vh] max-md:px-6 max-md:py-[12vh]">
      <WorksBg />
      <SecHead idx="02" zh="项目" en="SELECTED PROJECT" />

      <div className="relative z-2">
        <WorkArticle
          index="01"
          even={false}
          artClass="bg-ink"
          art={
            <>
              <div
                aria-hidden
                className="bg-scarlet absolute top-[8%] right-[7%] aspect-square w-[40%] rounded-full bg-[radial-gradient(circle,var(--color-acid)_2.6px,transparent_3.2px)] bg-size-[14px_14px]"
              />
              <div
                aria-hidden
                className="font-disp text-fluid-13 text-stroke-aqua text-stroke-3 absolute bottom-[4%] left-[3%] leading-none text-transparent"
              >
                &lt;/&gt;
              </div>
              <span
                aria-hidden
                className="border-ink bg-acid font-zh text-fluid-2.5 text-ink shadow-paper-6 absolute top-[34%] left-[12%] -rotate-3 border-3 px-4 py-2.5 font-black"
              >
                开源中 · STAR ME
              </span>
              <span className="font-spacemono tracking-30 text-paper absolute top-[8%] left-[6%] text-xs font-bold">
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
          linkExternal
        />
      </div>
    </section>
  );
}
