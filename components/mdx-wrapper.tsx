"use client";

import { ReactNode, useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({ fontSize: 16, fontFamily: "var(--font-zh)" });

const generateDiagramId = (() => {
  let index = 0;
  return () => {
    return `diagram-${index++}`;
  };
})();

export function MdxWrapper({ children }: { children: ReactNode }) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!articleRef.current) return;

    let cancelled = false;

    const nodes = articleRef.current.querySelectorAll<HTMLPreElement>(
      "pre:has(code.language-mermaid)",
    );

    nodes.forEach((node) => {
      mermaid
        .render(generateDiagramId(), node.textContent)
        .then((rendered) => {
          if (cancelled) return;

          const diagram = document.createElement("p");
          diagram.classList.add("diagram");
          diagram.innerHTML = rendered.svg;

          const svg = diagram.firstChild as SVGSVGElement;
          const rect = svg.viewBox.baseVal;
          svg.style.maxWidth = `calc(${rect.width / 16} * 1em)`;

          node.replaceWith(diagram);
        })
        .catch((error: unknown) => {
          node.classList.add("diagram-error");
          console.error(error);
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <article ref={articleRef}>{children}</article>;
}
