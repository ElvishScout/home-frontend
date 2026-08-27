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

          const paragraph = document.createElement("p");

          const diagram = document.createElement("div");
          diagram.classList.add("diagram");

          const wrapper = document.createElement("div");
          wrapper.innerHTML = rendered.svg;

          const svg = wrapper.firstChild as SVGSVGElement;
          const rect = svg.viewBox.baseVal;
          svg.style.maxWidth = "";

          wrapper.style.margin = "0 auto";
          wrapper.style.width = `calc(${rect.width / 16} * 1em)`;
          wrapper.style.maxWidth = "100%";

          diagram.appendChild(wrapper);
          paragraph.appendChild(diagram);

          node.replaceWith(paragraph);
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
