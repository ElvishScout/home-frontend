"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/** 缩放区间与滚轮手感；地图式——以指针为锚点连续缩放，不做档位。 */
const MIN_SCALE = 1;
const MAX_SCALE = 8;
const WHEEL_SENSITIVITY = 0.0015;
/** 双击在「含入」与该倍率之间切换，顺便给「甩丢了」留一条退路。 */
const DOUBLE_TAP_SCALE = 2;
/** 判定为拖拽而非点击的位移阈值（px）。 */
const DRAG_THRESHOLD = 4;

/** 行/页滚动的 deltaY 与像素不是一个量级，先归一到像素再取指数。 */
const DELTA_UNIT: Record<number, number> = { 0: 1, 1: 16, 2: 100 };

/**
 * 让内容点击后全屏显示，并支持滚轮/双指缩放与拖拽平移。
 *
 * `children` 会被渲染两次：内联那份包在触发按钮里，全屏那份在 portal 出来的
 * 遮罩里。因此它必须是可重复渲染的普通元素——不能是已经存在于文档中的活节点。
 * 两份内容不同时用 `overlayContent`（mermaid 全屏那份需要换一套 id）。
 *
 * 遮罩 portal 到 document.body：既躲开 .prose 的正文排版继承，也不受祖先
 * transform 影响。只在打开时渲染，SSR 阶段不会碰到 document。
 */
export function ZoomViewer({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // 关掉之后把焦点还给触发它的那个元素，键盘用户不会掉到页面顶部
  useEffect(() => {
    if (!open) return;
    return () => {
      const el = triggerRef.current;
      if (el?.isConnected) el.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="block w-full cursor-zoom-in"
        aria-label={`全屏查看：${label}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open &&
        createPortal(
          <ZoomOverlay label={label} onClose={close}>
            {children}
          </ZoomOverlay>,
          document.body,
        )}
    </>
  );
}

/**
 * 全屏遮罩。基准尺寸交给 CSS（内容含入舞台），用户缩放是叠在上面的 transform，
 * 所以不需要计算 fit；只有平移夹取需要知道内容实际画出来多大。
 */
function ZoomOverlay({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // 手势期间不走 React state：直接改 style，免得每帧 reconcile 一次
  const view = useRef({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mid: { x: number; y: number } } | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const downAt = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  // setPointerCapture 会把后续的 click 一并重定向到舞台，事后看 e.target 判断不出
  // 「按在图上还是按在空白处」，只能在 pointerdown 时先记下来。
  const downOnContent = useRef(false);

  /** 内容的固有尺寸：SVG 取 viewBox，位图取 naturalWidth/Height。还没量到（未加载完）返回 null。 */
  const naturalSize = useCallback(() => {
    const media = contentRef.current?.querySelector("img, svg");
    if (media instanceof SVGSVGElement) {
      const { width, height } = media.viewBox.baseVal;
      return width && height ? { width, height } : null;
    }
    if (media instanceof HTMLImageElement) {
      return media.naturalWidth && media.naturalHeight
        ? { width: media.naturalWidth, height: media.naturalHeight }
        : null;
    }
    return null;
  }, []);

  /** 含入舞台的比例。只缩不放：小图保持 1:1，要更大就自己滚。 */
  const fitScale = useCallback(() => {
    const stage = stageRef.current;
    const natural = naturalSize();
    if (!stage || !natural) return null;
    return {
      natural,
      base: Math.min(1, stage.clientWidth / natural.width, stage.clientHeight / natural.height),
    };
  }, [naturalSize]);

  /**
   * 缩放靠改元素的实际尺寸，不靠 transform: scale。
   * 矢量图被 CSS transform 放大时，浏览器先把图层栅格化再拉伸，SVG 就糊了；
   * 改尺寸则会按新尺寸重新栅格化，放到多少都清晰。
   */
  const apply = useCallback(() => {
    const el = contentRef.current;
    const fit = fitScale();
    if (!el || !fit) return;
    const { s, x, y } = view.current;
    const scale = fit.base * s;
    el.style.width = `${fit.natural.width * scale}px`;
    el.style.height = `${fit.natural.height * scale}px`;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [fitScale]);

  /** 图不会被拖出视野：缩放后的图边缘最多贴到舞台边缘。尺寸没量到时不夹。 */
  const clampPan = useCallback(() => {
    const stage = stageRef.current;
    const fit = fitScale();
    if (!stage || !fit) return;
    const v = view.current;
    const maxX = Math.max(0, (fit.natural.width * fit.base * v.s - stage.clientWidth) / 2);
    const maxY = Math.max(0, (fit.natural.height * fit.base * v.s - stage.clientHeight) / 2);
    v.x = Math.min(maxX, Math.max(-maxX, v.x));
    v.y = Math.min(maxY, Math.max(-maxY, v.y));
  }, [fitScale]);

  /** 以 (px, py)（相对舞台中心）为锚点缩放到 scale，让指针下的内容点停在原处。 */
  const zoomAt = useCallback(
    (scale: number, px: number, py: number) => {
      const v = view.current;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
      if (next === v.s) return;
      v.x = px - (next * (px - v.x)) / v.s;
      v.y = py - (next * (py - v.y)) / v.s;
      v.s = next;
      // 回到含入态必须居中，否则来回滚几次会累积偏移
      if (v.s === MIN_SCALE) {
        v.x = 0;
        v.y = 0;
      }
      clampPan();
      apply();
    },
    [apply, clampPan],
  );

  const reset = useCallback(() => {
    view.current.x = 0;
    view.current.y = 0;
    view.current.s = MIN_SCALE;
    apply();
  }, [apply]);

  // 首次排版，以及位图加载完之后再排一次（那时才量得到 naturalWidth）
  useEffect(() => {
    apply();
    const media = contentRef.current?.querySelector("img");
    if (!(media instanceof HTMLImageElement) || media.complete) return;

    const onLoad = () => apply();
    media.addEventListener("load", onLoad);
    return () => media.removeEventListener("load", onLoad);
  }, [apply]);

  // 锁滚动（连同滚动条占位一起还原）、把焦点移到关闭按钮、Esc 退出、Tab 不逃出对话框
  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab") {
        // 对话框里只有一个可聚焦元素，别让 Tab 跑到背后的正文上
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // React 把 wheel 注册成 passive 的根监听，onWheel 里 preventDefault 不生效，
  // 只能自己挂一个非 passive 的，否则页面会跟着一起滚。
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const delta = event.deltaY * (DELTA_UNIT[event.deltaMode] ?? 1);
      zoomAt(
        view.current.s * Math.exp(-delta * WHEEL_SENSITIVITY),
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const measurePinch = () => {
    const [a, b] = [...pointers.current.values()];
    return {
      dist: Math.hypot(b.x - a.x, b.y - a.y),
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // 控件自己处理自己的点击，不参与拖拽
    if ((event.target as HTMLElement).closest("[data-zoom-ui]")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    downOnContent.current = !!contentRef.current?.contains(event.target as Node);
    moved.current = false;
    downAt.current = { x: event.clientX, y: event.clientY };
    overlayRef.current?.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    } else if (pointers.current.size === 2) {
      drag.current = null;
      pinch.current = measurePinch();
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const start = downAt.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > DRAG_THRESHOLD) {
      moved.current = true;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();

    if (pointers.current.size >= 2) {
      const next = measurePinch();
      const previous = pinch.current;
      if (previous && previous.dist > 0 && next.dist > 0) {
        // 中点位移当平移、两指距离变化当缩放，两者可以同时发生
        view.current.x += next.mid.x - previous.mid.x;
        view.current.y += next.mid.y - previous.mid.y;
        zoomAt(
          view.current.s * (next.dist / previous.dist),
          next.mid.x - (rect.left + rect.width / 2),
          next.mid.y - (rect.top + rect.height / 2),
        );
      }
      pinch.current = next;
      return;
    }

    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    view.current.x += event.clientX - current.x;
    view.current.y += event.clientY - current.y;
    current.x = event.clientX;
    current.y = event.clientY;
    clampPan();
    apply();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (drag.current?.id === event.pointerId) drag.current = null;
    if (pointers.current.size < 2) pinch.current = null;

    // 双指抬起一根后，剩下的那根接着拖，不要跳
    if (pointers.current.size === 1) {
      const [id, point] = [...pointers.current.entries()][0];
      drag.current = { id, x: point.x, y: point.y };
    }
  };

  // 点内容以外的地方（图周围的空白）才关；点在图上不关
  const onClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (moved.current || downOnContent.current) return;
    if ((event.target as HTMLElement).closest("[data-zoom-ui]")) return;
    onClose();
  };

  const onDoubleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-zoom-ui]")) return;
    if (view.current.s > MIN_SCALE) {
      reset();
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    zoomAt(
      DOUBLE_TAP_SCALE,
      event.clientX - (rect.left + rect.width / 2),
      event.clientY - (rect.top + rect.height / 2),
    );
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-8000 animate-zoom-wipe bg-ink/95 outline-none motion-reduce:animate-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      // 兜底：任何可拖的子元素（img、mermaid 里的 <image>、链接）都不该把
      // 拖拽手势变成原生拖放
      onDragStart={(event) => event.preventDefault()}
    >
      <div
        ref={stageRef}
        className="absolute inset-x-8 inset-y-16 flex cursor-grab touch-none items-center justify-center overflow-hidden select-none active:cursor-grabbing"
      >
        <div className="flex h-full w-full animate-zoom-figure items-center justify-center motion-reduce:animate-none">
          <div
            ref={contentRef}
            className="zoom-content flex shrink-0 origin-center items-center justify-center will-change-transform"
          >
            {children}
          </div>
        </div>
      </div>

      <button
        className="group/close wipe-paper absolute top-6 right-6 isolate flex button-hard-4 items-center gap-2 overflow-hidden border-2 border-paper bg-ink px-3 py-2 font-spacemono text-xs font-bold tracking-18 text-paper shadow-paper hover:text-ink"
        onClick={onClose}
      >
        <span aria-hidden>✕</span>
        关闭
      </button>

      <p
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-spacemono text-2xs font-bold tracking-16 text-paper/60"
      >
        滚轮 / 双指缩放 · 拖动平移 · 双击归位 · Esc 退出
      </p>
    </div>
  );
}
