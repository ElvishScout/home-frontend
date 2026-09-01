"use client";

import { Fragment, ReactNode, useLayoutEffect, useRef, useState } from "react";

const DEFAULT_SPEED = 80; // px/s，视觉滚动速度
const MAX_REPEAT = 50;

export function MarqueeBlock({
  items,
  className = "",
}: {
  items: Iterable<ReactNode>;
  className?: string;
}) {
  return (
    <>
      {Array.from(items).map((item, i) => (
        <span key={i} className={`inline-flex items-center ${className}`}>
          {item}
          <span aria-hidden className="marquee-star text-[0.75em]">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

export function MarqueeRow({
  className = "",
  speed = DEFAULT_SPEED,
  reverse,
  children,
}: {
  className?: string;
  speed?: number;
  reverse?: boolean;
  children?: ReactNode;
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
        const nextRepeat = Math.min(Math.max(2, Math.ceil(rowWidth / singleWidth) * 2), MAX_REPEAT);
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
  }, [speed]);

  return (
    // relative 让隐藏测量副本的包含块落在行内，从而被 overflow-hidden 裁掉；
    // 否则 absolute 副本逃逸到初始包含块，移动端 Chrome 会因此扩大布局视口
    <div ref={rowRef} className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      {/* 隐藏的单个副本，用于独立测量一份内容的宽度，避免 repeat 与 trackWidth 互相依赖 */}
      <span
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none invisible absolute -z-10 inline-flex w-fit`}
      >
        {children}
      </span>
      <div
        ref={trackRef}
        className={`animate-mq inline-flex w-fit will-change-transform ${reverse ? "[animation-direction:reverse]" : ""}`}
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {Array.from({ length: repeat }, (_, i) => (
          <Fragment key={i}>{children}</Fragment>
        ))}
      </div>
    </div>
  );
}
