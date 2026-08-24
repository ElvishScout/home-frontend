import { SecHead } from "./sec-head";
import { WorksBg } from "./works-bg";
import { WorkArticle } from "./work-article";
import { LossArt } from "./loss-art";

const EQ_BARS = [
  { h: "h-[45%]", bg: "bg-acid", delay: "" },
  { h: "h-[82%]", bg: "bg-aqua", delay: "[animation-delay:120ms]" },
  { h: "h-[60%]", bg: "bg-paper", delay: "[animation-delay:240ms]" },
  { h: "h-[96%]", bg: "bg-scarlet", delay: "[animation-delay:360ms]" },
  { h: "h-[54%]", bg: "bg-aqua", delay: "[animation-delay:480ms]" },
  { h: "h-[76%]", bg: "bg-acid", delay: "[animation-delay:600ms]" },
  { h: "h-[38%]", bg: "bg-paper", delay: "[animation-delay:720ms]" },
];

export function Works() {
  return (
    <section id="works" className="relative px-12 py-[16vh] max-md:px-6 max-md:py-[12vh]">
      <WorksBg />
      <SecHead idx="02" zh="实验" en="SIDE PROJECTS" />

      <div className="relative z-2 flex flex-col gap-[14vh] max-lg:gap-[12vh]">
        <WorkArticle
          index="01"
          even={false}
          artClass="bg-ink"
          art={<LossArt />}
          en="LOSS / CURVE"
          title="训练过程可视化面板"
          desc="把几百小时的训练压缩成一条能看懂的曲线：loss、吞吐、显存占用同屏对照。那次凌晨三点的发散，一眼就能定位。"
          tags={["数据可视化", "前端", "2025"]}
        />

        <WorkArticle
          index="02"
          even
          artClass="bg-paper"
          art={
            <>
              <div
                aria-hidden
                className="absolute bottom-[-24%] left-[2%] font-disp text-[clamp(10rem,22vw,19rem)] leading-none text-transparent [-webkit-text-stroke:3px_var(--color-ink)]"
              >
                Aa
              </div>
              <div
                aria-hidden
                className="absolute top-0 right-0 h-full w-[44%] bg-ink [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]"
              />
              <div
                aria-hidden
                className="absolute top-[12%] right-[8%] aspect-square w-[26%] rounded-full border-4 border-acid bg-scarlet bg-[radial-gradient(circle,var(--color-acid)_2.4px,transparent_3px)] bg-size-[13px_13px]"
              />
              <span className="absolute top-[8%] left-[6%] font-spacemono text-xs font-bold tracking-[0.3em] text-ink">
                TYPE / SPECIMEN
              </span>
            </>
          }
          en="TYPE LAB"
          title="设计自学的排印练习"
          desc="没上过设计课，就把每张海报当一次作业：只许用字、网格和三种颜色。这是持续进行中的每周练习，也是这个主页审美的来源。"
          tags={["版式排印", "自学笔记", "进行中"]}
        />

        <WorkArticle
          index="03"
          even={false}
          artClass="bg-ink"
          art={
            <>
              <div
                aria-hidden
                className="absolute inset-[12%_8%] [background:repeating-linear-gradient(0deg,transparent_0_14px,rgba(0,255,226,0.55)_14px_16px),repeating-linear-gradient(90deg,transparent_0_14px,rgba(230,0,18,0.5)_14px_16px)]"
              />
              <div
                aria-hidden
                className="absolute right-[4%] bottom-[-6%] -rotate-6 font-zh text-[clamp(6rem,12vw,10rem)] font-black text-transparent [-webkit-text-stroke:3px_var(--color-aqua)]"
              >
                あ
              </div>
              <span className="absolute top-[10%] left-[6%] font-disp text-[clamp(1.8rem,4vw,3.4rem)] leading-none tracking-[0.04em] text-aqua">
                ANI
                <br />
                LOG
              </span>
            </>
          }
          en="ANI LOG"
          title="追番记录小站"
          desc="给每季新番做的私人记录页：进度、评分、一句话感想。数据源是我自己，更新频率取决于本周的更新表。"
          tags={["小工具", "当季更新中"]}
        />

        <WorkArticle
          index="04"
          even
          artClass="flex items-end gap-[3.5%] bg-ink px-[8%] pt-[34%]"
          art={
            <>
              <span className="absolute top-[8%] left-[6%] font-disp text-[clamp(2rem,4.5vw,4rem)] leading-none tracking-[0.04em] text-paper">
                SOUND
                <br />
                TOY
              </span>
              <span className="absolute top-[9%] right-[7%] border-2 border-acid px-2.5 py-1 font-spacemono text-xs font-bold tracking-[0.2em] text-acid">
                BPM 128 ♪
              </span>
              {EQ_BARS.map((bar, i) => (
                <i key={i} className={`eq-bar flex-1 origin-bottom animate-eq ${bar.h} ${bar.bg} ${bar.delay}`} />
              ))}
            </>
          }
          en="SOUND TOY"
          title="浏览器里的声音玩具"
          desc="学和声时的副产品：一个用 Web Audio 写的合成器小玩具，格子即音阶，点哪响哪。最终目标是写出一首真正的曲子。"
          tags={["WEB AUDIO", "编曲学习", "进行中"]}
        />
      </div>
    </section>
  );
}
