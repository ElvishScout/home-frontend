import Link from "next/link";
import registry from "virtual:mdx-registry";

export const metadata = {
  title: "文章",
};

function hrefOf(path: string): string {
  return `/${path.replace(/\.mdx$/, "")}`;
}

function formatDate(date: Date | null): string | null {
  return (
    date?.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) ?? null
  );
}

export default function ArticlesPage() {
  const entries = Object.values(registry).sort((a, b) => {
    if (!a.lastModified) return 1;
    if (!b.lastModified) return -1;
    return b.lastModified.getTime() - a.lastModified.getTime();
  });

  return (
    <>
      <h1 className="text-2xl font-bold">文章</h1>
      <ul className="mt-6 space-y-4">
        {entries.map((entry) => {
          const date = formatDate(entry.lastModified);
          return (
            <li key={entry.path}>
              <Link href={hrefOf(entry.path)} className="font-medium text-gray-900 hover:text-blue-700">
                {entry.title ?? entry.path}
              </Link>
              {date && (
                <p className="mt-1 text-sm text-gray-500">
                  <time dateTime={entry.lastModified!.toISOString()}>{date}</time>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
