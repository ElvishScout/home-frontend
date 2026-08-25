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
    <ul className="border-b-[3px] border-ink">
      {rows.map((row) => {
        const inner = (
          <>
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-acid [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-expo group-hover:[clip-path:inset(0_0_0_0)]"
            />
            <span className="pt-[0.3em] font-spacemono text-xs font-bold tracking-[0.18em] opacity-60">
              {row.num}
            </span>
            <span className="min-w-0">
              <span
                title={row.title}
                className="block truncate text-[clamp(1.1rem,2vw,1.5rem)] leading-snug font-black tracking-[0.02em]"
              >
                {row.title}
              </span>
              {row.note ? (
                <span className="mt-1 block font-spacemono text-[11px] font-bold tracking-[0.2em] opacity-60">
                  {row.note}
                </span>
              ) : null}
            </span>
            {row.meta ? (
              <span className="font-spacemono text-xs font-bold tracking-[0.14em] max-md:hidden">{row.meta}</span>
            ) : null}
          </>
        );

        return (
          <li key={`${row.num}-${row.title}`} className="border-t-[3px] border-ink">
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
