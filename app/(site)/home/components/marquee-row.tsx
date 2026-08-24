export function MarqueeRow({
  items,
  rowClassName,
  trackClassName = "",
  itemClassName,
  starClassName,
}: {
  items: string[];
  rowClassName: string;
  trackClassName?: string;
  itemClassName: string;
  starClassName: string;
}) {
  return (
    <div className={rowClassName}>
      <div className={`inline-flex animate-mq will-change-transform ${trackClassName}`}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className={itemClassName}>
            {item}
            <span aria-hidden className={starClassName}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
