import { SmoothLink } from "./providers";

const NAV = [
  { href: "#about", sup: "01", label: "ABOUT" },
  { href: "#projects", sup: "02", label: "CODE" },
  { href: "#blog", sup: "03", label: "BLOG" },
  { href: "#music", sup: "04", label: "MUSIC" },
  { href: "#skills", sup: "05", label: "SKILLS" },
  { href: "#contact", sup: "06", label: "CONTACT" },
];

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed -inset-1/2 z-9000 h-[200%] w-[200%] animate-grain bg-[url(/home/grain.svg)] opacity-5"
    />
  );
}

export function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-7000 flex items-center justify-between px-12 py-4.5 text-white mix-blend-difference max-md:px-6 max-md:py-3.5">
      <SmoothLink href="#top" className="flex items-center gap-2 font-disp text-xl tracking-wider">
        <span className="inline-block animate-spin-slow text-lg max-md:hidden">✦</span>ELVISH&nbsp;SCOUT
      </SmoothLink>
      <ul className="flex gap-7 max-md:gap-2.5">
        {NAV.map((item) => (
          <li key={item.href}>
            <SmoothLink
              href={item.href}
              className="group relative block py-1 font-spacemono text-xs font-bold tracking-[0.12em] max-md:text-[9px] max-md:tracking-[0.04em]"
            >
              <sup className="mr-0.5 text-[8px] opacity-60 max-md:hidden">{item.sup}</sup>
              {item.label}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-0.5 w-full origin-right scale-x-0 bg-white transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100"
              />
            </SmoothLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
