import Link from "next/link";

export type Row = {
  num: string;
  title: string;
  note?: string;
  meta?: string;
  href?: string;
};

/** 子页面行式列表：编号 + 标题 + 小注 + 右侧元信息；悬停整行从左擦入 acid。无 href 时渲染为静态行。 */
export function RowList({ rows }: { rows: Row[] }) {
  const rowClass =
    "group relative isolate grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 overflow-hidden px-4 py-5 max-md:gap-x-4 max-md:px-3";

  return (
    <ul className="border-ink border-b-3">
      {rows.map((row) => {
        const inner = (
          <>
            <span
              aria-hidden
              className="bg-acid ease-expo absolute inset-0 -z-10 transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
            />
            <span className="font-spacemono tracking-18 pt-1 text-xs font-bold opacity-60">
              {row.num}
            </span>
            <span className="min-w-0">
              <span
                title={row.title}
                className="text-fluid-2 block truncate leading-snug font-black tracking-wide"
              >
                {row.title}
              </span>
              {row.note ? (
                <span className="font-spacemono tracking-20 mt-1 block text-xs font-bold opacity-60">
                  {row.note}
                </span>
              ) : null}
            </span>
            {row.meta ? (
              <span className="font-spacemono tracking-14 text-xs font-bold max-md:hidden">
                {row.meta}
              </span>
            ) : null}
          </>
        );

        return (
          <li key={`${row.num}-${row.title}`} className="border-ink border-t-3">
            {row.href ? (
              <Link href={row.href} className={rowClass}>
                {inner}
              </Link>
            ) : (
              <div className={rowClass}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
