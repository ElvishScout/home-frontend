"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ fontSize: 16, fontFamily: "var(--font-zh)" });

const generateDiagramId = (() => {
  let index = 0;
  return () => {
    return `diagram-${index++}`;
  };
})();

/** ```mermaid 代码块经 remark-mermaid 插件在编译期换成本组件，code 即图表源码。 */
export function MermaidDiagram({ code }: { code: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(0);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let cancelled = false;

    mermaid
      .render(generateDiagramId(), code)
      .then((result) => {
        if (cancelled || !wrapperRef.current) return;

        // SVG 由 mermaid 生成，不走 React 渲染；wrapper 没有 React 子节点，
        // innerHTML 赋值不会与 reconciliation 冲突。
        const wrapper = wrapperRef.current;
        wrapper.innerHTML = result.svg;

        const svg = wrapper.firstChild as SVGSVGElement;
        svg.style.maxWidth = "";

        setSvgWidth(svg.viewBox.baseVal.width);
        setRendered(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className={rendered ? "diagram" : "diagram hidden"}>
      <div
        ref={wrapperRef}
        className="mx-auto max-w-full"
        // 16 = 根字号：viewBox 宽度从 px 换算成 em，图表跟随正文缩放
        style={{ width: `calc(${svgWidth / 16} * 1em)` }}
      />
    </div>
  );
}
