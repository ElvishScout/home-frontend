import Link from "next/link";
import registry from "virtual:mdx-registry";
import { registryKeyToHref } from "@/lib/articles";
import { formatDate } from "@/lib/date";

export const metadata = {
  title: "文章",
};

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
        {entries.map((entry) => (
          <li key={entry.path}>
            <Link href={registryKeyToHref(entry.path)} className="font-medium text-gray-900 hover:text-blue-700">
              {entry.title ?? entry.path}
            </Link>
            {entry.lastModified && (
              <p className="mt-1 text-sm text-gray-500">
                <time dateTime={entry.lastModified.toISOString()}>{formatDate(entry.lastModified)}</time>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
