import { SecHead } from "./sec-head";
import { Reveal } from "./reveal";
import { EntryList, MoreLink, type Entry } from "./entry-list";

const POSTS: Entry[] = [
  {
    num: "EP.01",
    title: "让元素蹦出来，而不是淡出来",
    note: "GSAP 入场编排笔记",
    meta: "2026.08",
    href: "/articles",
  },
  {
    num: "EP.02",
    title: "Turbopack 在 Windows 上的路径脾气",
    note: "工程踩坑记录",
    meta: "2026.07",
    href: "/articles",
  },
  {
    num: "EP.03",
    title: "把设计规范写进 AGENTS.md 之后",
    note: "AI 协作实验",
    meta: "2026.06",
    href: "/articles",
  },
];

export function Blog() {
  return (
    <section
      id="blog"
      className="bg-ink text-paper relative px-12 py-[16vh] max-md:px-6 max-md:py-[12vh]"
    >
      <SecHead idx="03" zh="博客" en="TECH BLOG" dark />

      <div className="grid grid-cols-12 items-stretch gap-x-10 max-lg:flex max-lg:flex-col max-lg:gap-14">
        <div className="col-span-5 flex flex-col">
          <Reveal className="text-fluid-3.5 max-w-xl leading-snug font-black">
            好记性不如<em className="bg-acid text-ink px-2 not-italic">烂笔头</em>，
            <br />
            写下来，才算学会。
          </Reveal>
          <Reveal className="font-spacemono tracking-14 mt-8 text-xs leading-loose opacity-70">
            POSTS 23 ✦ WORDS 86K
            <br />
            UPDATED 2026.08
            <br />
            TECH NOTES
          </Reveal>
          <Reveal className="mt-auto pt-4">
            <MoreLink href="/articles" label="查看更多 · ALL POSTS" dark />
          </Reveal>
        </div>
        <div className="col-span-7">
          <EntryList items={POSTS} dark />
        </div>
      </div>
    </section>
  );
}
