import registry from "virtual:mdx-registry";
import { registryKeyToHref } from "@/lib/articles";
import { formatYearMonth } from "@/lib/date";
import { Reveal } from "./reveal";
import { EntryList, MoreLink, type Entry } from "./entry-list";
import { Section } from "./section";

/** 按修改时间倒序取最新三篇；编号沿用列表页规则（EP.01 为最旧一篇）。 */
const ENTRIES = Object.values(registry).sort((a, b) => {
  if (!a.lastModified) return 1;
  if (!b.lastModified) return -1;
  return b.lastModified.getTime() - a.lastModified.getTime();
});
const POSTS: Entry[] = ENTRIES.slice(0, 3).map((entry, i) => ({
  num: `EP.${String(ENTRIES.length - i).padStart(2, "0")}`,
  title: entry.title ?? entry.path,
  note: entry.path.split("/")[1]?.replaceAll("-", " ").toUpperCase() ?? "",
  meta: entry.lastModified ? formatYearMonth(entry.lastModified) : "",
  href: registryKeyToHref(entry.path),
}));
const UPDATED = ENTRIES[0]?.lastModified ? formatYearMonth(ENTRIES[0].lastModified) : "";

export function Blog() {
  return (
    <Section id="blog" index="03" zh="博客" en="TECH BLOG" dark>
      <div className="col-span-5 flex flex-col">
        <Reveal className="text-fluid-3xl max-w-xl leading-snug font-black">
          好记性不如<em className="bg-acid text-ink px-2 not-italic">烂笔头</em>，
          <br />
          写下来，才算学会。
        </Reveal>
        <Reveal className="font-spacemono tracking-14 mt-8 text-xs leading-loose opacity-70">
          POSTS {String(ENTRIES.length).padStart(2, "0")}
          <br />
          UPDATED {UPDATED}
          <br />
          TECH NOTES
        </Reveal>
        <Reveal className="mt-auto pt-8">
          <MoreLink href="/articles" label="查看更多 · ALL POSTS" dark />
        </Reveal>
      </div>

      <div className="col-span-7">
        <EntryList items={POSTS} dark />
      </div>
    </Section>
  );
}
