import { Reveal } from "./reveal";
import { Statement } from "./statement";
import { StatNum } from "./stat-num";
import { Section } from "./section";

const STATS: { count?: number; value?: string; color: string; label: string }[] = [
  { count: 1, color: "text-acid", label: "份正职 · 大模型预训练" },
  { count: 2, color: "text-aqua", label: "条赛道 · 全栈 → 预训练" },
  { count: 1, color: "text-scarlet", label: "首曲子 · 还在路上" },
  { value: "24′", color: "text-paper", label: "分钟 · 新番的时间单位" },
];

export function About() {
  return (
    <Section id="about" index="01" zh="关于我" en="ABOUT ME" dark>
      <Statement className="col-span-12" />

      <Reveal className="col-span-7 text-base leading-loose opacity-85">
        <p>
          我是一名程序员，目前的主业是大模型预训练。入行不算久，之前写过一年全栈，从页面到接口都做过。
          <strong className="text-acid">赛道换过一次，写代码这件事一直没变。</strong>
        </p>
        <p className="mt-5">
          工作之外，时间主要分给三样：音乐、游戏、新番。音乐在系统地学，乐理、和声、编曲一样一样来，目标很具体：写出一首自己愿意单曲循环的歌。新番按季追，24 分钟是雷打不动的时间单位。游戏打得杂，是三样里唯一不设目标的。
        </p>
      </Reveal>

      <div className="bg-paper col-span-5 grid grid-cols-2 gap-0.75 p-0.75">
        {STATS.map((stat) => (
          <div key={stat.label} className="overflow-hidden">
            <Reveal className="bg-ink relative h-full px-5.5 py-6.5">
              {stat.count !== undefined ? (
                <StatNum
                  count={stat.count}
                  className={`font-disp text-fluid-4xl block leading-none ${stat.color}`}
                />
              ) : (
                <span className={`font-disp text-fluid-4xl block leading-none ${stat.color}`}>
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
