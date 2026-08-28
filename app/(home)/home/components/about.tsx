import { Reveal } from "./reveal";
import { Statement } from "./statement";
import { StatNum } from "./stat-num";
import { Section } from "./section";

const STATS: { count?: number; value?: string; color: string; label: string }[] = [
  { count: 1, color: "text-acid", label: "份主业 · 大模型训练" },
  { count: 2, color: "text-aqua", label: "门手艺 · 前端与设计" },
  { count: 3, color: "text-scarlet", label: "条轨道 · 音乐练习中" },
  { value: "24′", color: "text-paper", label: "分钟 · 新番的时间单位" },
];

export function About() {
  return (
    <Section id="about" index="01" zh="关于我" en="ABOUT ME" dark>
      <Statement className="col-span-12" />

      <Reveal className="col-span-7 text-base leading-loose opacity-85">
        <p>
          我是一名程序员，主业是训练大模型——在数据和算力之间追求稳定与效率。但这个主页不走那条路。没系统学过设计，就把它当成一次公开练习：先把版式推到极限，再亲手用代码一比一还原。
          <strong className="text-acid">写得动模型，也写得动页面。</strong>
        </p>
        <p className="mt-5">
          业余时间在学音乐，乐理、和声、编曲，目标很朴素：写出一首自己愿意单曲循环的曲子。剩下的余量，留给当季新番。
        </p>
      </Reveal>

      <div className="bg-paper col-span-5 grid grid-cols-2 gap-0.75 p-0.75">
        {STATS.map((stat) => (
          <div key={stat.label} className="overflow-hidden">
            <Reveal className="bg-ink relative h-full px-5.5 py-6.5">
              {stat.count !== undefined ? (
                <StatNum
                  count={stat.count}
                  className={`font-disp text-fluid-5 block leading-none ${stat.color}`}
                />
              ) : (
                <span className={`font-disp text-fluid-5 block leading-none ${stat.color}`}>
                  {stat.value}
                </span>
              )}
              <span className="font-spacemono tracking-18 mt-2.5 block text-xs opacity-70">
                {stat.label}
              </span>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
