import { ReactNode } from "react";
import Link from "next/link";
import { NavLink } from "./nav-link";

/**
 * 子页面统一外壳（设计规范 · 子页面 §1）。
 * 只作用于 (sub) 组内的子页面（/articles、/music…）；首页在 (home) 组，不经由本布局。
 */
export default function SubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper font-zh text-ink selection:bg-acid selection:text-ink flex min-h-svh flex-col">
      {/* 全局材质签名：动态噪点 */}
      <div
        aria-hidden
        className="animate-grain pointer-events-none fixed -inset-1/2 z-9000 h-[200%] w-[200%] bg-[url(/grain.svg)] opacity-5"
      />

      <header className="bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/home" className="font-disp flex items-center gap-2 text-lg tracking-wider">
            <span aria-hidden className="animate-spin-slow inline-block text-base">
              ✦
            </span>
            ELVISH&nbsp;SCOUT
          </Link>
          <nav className="flex gap-6">
            <NavLink href="/articles" label="ARTICLES" />
            <NavLink href="/music" label="MUSIC" />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 max-md:py-10">{children}</main>

      <footer className="bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-5">
          <span className="font-disp text-sm tracking-wider">ELVISH&nbsp;SCOUT</span>
          <span className="font-spacemono tracking-18 text-xs opacity-60">
            CODE ✦ MUSIC ✦ ANIME
          </span>
          <a
            href="mailto:elvishscoutustc@gmail.com"
            className="font-spacemono tracking-14 hover:text-acid text-xs transition-colors duration-300"
          >
            elvishscoutustc@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
