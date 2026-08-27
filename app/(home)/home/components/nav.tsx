import { SmoothLink } from "./providers";

const NAV = [
  { href: "#about", sup: "01", label: "ABOUT" },
  { href: "#projects", sup: "02", label: "CODE" },
  { href: "#blog", sup: "03", label: "BLOG" },
  { href: "#music", sup: "04", label: "MUSIC" },
  { href: "#skills", sup: "05", label: "SKILLS" },
  { href: "#contact", sup: "06", label: "CONTACT" },
];

export function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-7000 flex items-center justify-between px-12 py-4.5 text-white mix-blend-difference max-md:px-6 max-md:py-3.5">
      <SmoothLink href="#top" className="font-disp flex items-center gap-2 text-xl tracking-wider">
        <span className="animate-spin-slow inline-block text-lg max-md:hidden">✦</span>
        ELVISH&nbsp;SCOUT
      </SmoothLink>
      <ul className="flex gap-7 max-md:gap-2.5">
        {NAV.map((item) => (
          <li key={item.href}>
            <SmoothLink
              href={item.href}
              className="group font-spacemono tracking-12 max-md:text-3xs relative block py-1 text-xs font-bold max-md:tracking-wider"
            >
              <sup className="text-3xs mr-0.5 opacity-60 max-md:hidden">{item.sup}</sup>
              {item.label}
              <span
                aria-hidden
                className="ease-expo absolute bottom-0 left-0 h-0.5 w-full origin-right scale-x-0 bg-white transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"
              />
            </SmoothLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
