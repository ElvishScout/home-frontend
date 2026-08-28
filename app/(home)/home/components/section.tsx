import { ReactNode } from "react";
import { SecHead } from "./sec-head";

export function Section({
  id,
  className = "",
  index,
  zh,
  en,
  dark,
  background,
  children,
}: {
  id?: string;
  className?: string;
  index: string;
  zh: string;
  en: string;
  dark?: boolean;
  background?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative px-12 py-[16vh] max-md:px-6 max-md:py-[12vh] ${dark ? "bg-ink text-paper" : ""} ${className}`}
    >
      {background}
      <div className="relative mx-auto max-w-7xl">
        <SecHead idx={index} zh={zh} en={en} dark={dark} />
        <div className="grid grid-cols-12 items-stretch gap-x-12 gap-y-16 max-lg:flex max-lg:flex-col max-lg:gap-14">
          {children}
        </div>
      </div>
    </section>
  );
}
