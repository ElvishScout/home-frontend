import { SecHead } from "./sec-head";
import { Reveal } from "./reveal";
import { Statement } from "./statement";
import { StatNum } from "./stat-num";

const STATS: { count?: number; value?: string; color: string; label: string }[] = [
  { count: 1, color: "text-acid", label: "份主业 · 大模型训练" },
  { count: 2, color: "text-aqua", label: "门手艺 · 前端与设计" },
  { count: 3, color: "text-scarlet", label: "条轨道 · 音乐练习中" },
  { value: "24′", color: "text-paper", label: "分钟 · 新番的时间单位" },
];

export function About() {
  return (
    <section id="about" className="relative bg-ink px-12 py-[16vh] text-paper max-md:px-6 max-md:py-[12vh]">
      <SecHead idx="01" zh="关于我" en="ABOUT ME" dark />

      <Statement />

      <div className="mt-[10vh] grid grid-cols-[1.2fr_0.8fr] items-start gap-15 max-lg:grid-cols-1 max-lg:gap-10">
        <Reveal className="max-w-[34em] text-[15px] leading-[2.2] opacity-85">
          <p>
            我是一名程序员，主业是训练大模型——在数据和算力之间追求稳定与效率。但这个主页不走那条路。没系统学过设计，就把它当成一次公开练习：先把版式推到极限，再亲手用代码一比一还原。
            <strong className="text-acid">写得动模型，也写得动页面。</strong>
          </p>
          <p className="mt-[1.2em]">
            业余时间在学音乐，乐理、和声、编曲，目标很朴素：写出一首自己愿意单曲循环的曲子。剩下的余量，留给当季新番。
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-0.5 bg-paper">
          {STATS.map((stat) => (
            <Reveal key={stat.label} className="relative border-2 border-paper bg-ink px-5.5 py-6.5">
              {stat.count !== undefined ? (
                <StatNum
                  count={stat.count}
                  className={`block font-disp text-[clamp(2.4rem,5vw,4rem)] leading-none ${stat.color}`}
                />
              ) : (
                <span className={`block font-disp text-[clamp(2.4rem,5vw,4rem)] leading-none ${stat.color}`}>
                  {stat.value}
                </span>
              )}
              <span className="mt-2.5 block font-spacemono text-[11px] tracking-[0.18em] opacity-70">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
