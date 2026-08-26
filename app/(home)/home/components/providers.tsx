"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

/* ---------- Lenis 平滑滚动 ---------- */

let lenis: Lenis | null = null;
const lenisListeners = new Set<() => void>();

function subscribeLenis(cb: () => void) {
  lenisListeners.add(cb);
  return () => {
    lenisListeners.delete(cb);
  };
}

function emitLenis() {
  lenisListeners.forEach((cb) => cb());
}

export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribeLenis,
    () => lenis,
    () => null,
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1 });
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
    emitLenis();
    return () => {
      instance.destroy();
      gsap.ticker.remove(raf);
      lenis = null;
      emitLenis();
    };
  }, []);

  return children;
}

/** 页内锚点链接：onClick 时经 Lenis 平滑滚动到目标区块。 */
export function SmoothLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const lenis = useLenis();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
    onNavigate?.();
  };
  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

/* ---------- Loader 完成信号 ---------- */

const IntroContext = createContext<{ done: boolean; complete: () => void }>({
  done: false,
  complete: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const complete = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, complete }), [done, complete]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
