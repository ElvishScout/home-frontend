import registry from "virtual:mdx-registry";
import { registryKeyToHref } from "@/lib/articles";
import { formatDate } from "@/lib/date";
import { PageHead } from "../components/page-head";
import { RowList } from "../components/row-list";

export const metadata = {
  title: "技术博客",
};

export default function ArticlesPage() {
  const entries = Object.values(registry).sort((a, b) => {
    if (!a.lastModified) return 1;
    if (!b.lastModified) return -1;
    return b.lastModified.getTime() - a.lastModified.getTime();
  });

  return (
    <>
      <PageHead
        tag="TECH BLOG"
        title="技术博客"
        meta={`POSTS ${String(entries.length).padStart(2, "0")}`}
      />
      <RowList
        rows={entries.map((entry, i) => ({
          num: `EP.${String(entries.length - i).padStart(2, "0")}`,
          title: entry.title ?? entry.path,
          meta: entry.lastModified ? formatDate(entry.lastModified) : undefined,
          href: registryKeyToHref(entry.path),
        }))}
      />
    </>
  );
}
