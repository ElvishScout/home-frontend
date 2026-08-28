"use client";

import { useLayoutEffect, useRef, useState } from "react";

const DEFAULT_SPEED = 80; // px/s，视觉滚动速度

export function MarqueeRow({
  items,
  rowClassName,
  trackClassName = "",
  itemClassName,
  starClassName,
  speed = DEFAULT_SPEED,
}: {
  items: string[];
  rowClassName: string;
  trackClassName?: string;
  itemClassName: string;
  starClassName: string;
  speed?: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(2);
  const [duration, setDuration] = useState<number>();

  useLayoutEffect(() => {
    if (!rowRef.current || !measureRef.current || !trackRef.current) return;

    const update = () => {
      if (!rowRef.current || !measureRef.current || !trackRef.current) return;

      const rowWidth = rowRef.current.getBoundingClientRect().width;
      const singleWidth = measureRef.current.getBoundingClientRect().width;
      if (singleWidth) {
        // 动画 translateX(-50%) 要求轨道总长 >= 2 倍容器宽，
        // 且前后两半内容完全相同，因此 repeat 必须是偶数。
        const nextRepeat = Math.max(2, Math.ceil(rowWidth / singleWidth) * 2);
        setRepeat(nextRepeat);
      }

      const trackWidth = trackRef.current.getBoundingClientRect().width;
      if (trackWidth && speed) {
        // translateX(-50%) 每周期内容实际移动 trackWidth/2
        setDuration(trackWidth / (2 * speed));
      }
    };

    const observer = new ResizeObserver(update);
    observer.observe(rowRef.current);
    observer.observe(measureRef.current);
    observer.observe(trackRef.current);
    update();

    return () => {
      observer.disconnect();
    };
  }, [items, speed]);

  return (
    <div ref={rowRef} className={rowClassName}>
      {/* 隐藏的单个副本，用于独立测量一份内容的宽度，避免 repeat 与 trackWidth 互相依赖 */}
      <span
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none invisible absolute -z-10 inline-flex w-fit ${trackClassName}`}
      >
        {items.map((item, j) => (
          <span key={j} className={itemClassName}>
            {item}
            <span aria-hidden className={starClassName}>
              ✦
            </span>
          </span>
        ))}
      </span>
      <div
        ref={trackRef}
        className={`animate-mq inline-flex w-fit will-change-transform ${trackClassName}`}
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {Array.from({ length: repeat }, (_, i) =>
          items.map((item, j) => (
            <span key={i * items.length + j} className={itemClassName}>
              {item}
              <span aria-hidden className={starClassName}>
                ✦
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
