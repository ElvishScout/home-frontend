"use client";

import { useEffect, useState, type CSSProperties } from "react";
import mermaid from "mermaid";
import { ZoomViewer } from "./zoom-viewer";

const MERMAID_FONT_SIZE = 16;

mermaid.initialize({
  forceLegacyMathML: true,
  themeVariables: {
    fontFamily: "inherit",
    fontSize: `${MERMAID_FONT_SIZE}px`,
  },
  flowchart: {
    minNodeWidth: 24,
  },
});

const generateDiagramId = (() => {
  let index = 0;
  return () => {
    return `diagram-${index++}`;
  };
})();

/**
 * useMaxWidth（默认开启）时 mermaid 会给根 svg 塞 style="max-width: Wpx;"，
 * 全屏那份因此涨不过这个宽度。宽度本就由容器控制，去掉它。
 */
function stripMaxWidth(markup: string): string {
  return markup.replace(/(<svg\b[^>]*?)\s+style="max-width:[^"]*"/, "$1");
}

/**
 * 全屏那份换一套 id。mermaid 把主题样式编译在 `#diagram-N` 命名空间下
 * （`#diagram-N .node rect{…}`），箭头 marker 的 id 与 a11y 标题 id 也都由它派生；
 * 而内联 SVG 里的 <style> 是文档级生效的，两份同 id 会既重复样式、又让文档里出现
 * 成套重复 id，marker 的 url(#…) 还会跨副本指到内联那份去。整体改名后两份各自
 * 独立。同一份 markup 里只含它自己的 id，所以整体替换不会误伤别的图。
 */
function retag(markup: string, id: string): string {
  return markup.replaceAll(id, `${id}-z`);
}

/** ```mermaid 代码块经 remark-mermaid 插件在编译期换成本组件，code 即图表源码。 */
export function MermaidDiagram({ code }: { code: string }) {
  // 存字符串而不是解析后的节点：同一份图要出现在正文和全屏两处，
  // 一个 DOM 节点放不了两个位置，而字符串可以渲染任意多份。
  const [diagram, setDiagram] = useState<{ inline: string; full: string; width: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const id = generateDiagramId();

    mermaid
      .render(id, code)
      .then((result) => {
        if (cancelled) return;

        const inline = stripMaxWidth(result.svg);
        // 只为量 viewBox 宽度挂一次 DOM。用 HTML 解析而不是 DOMParser 的
        // image/svg+xml：mermaid 的标签里有 &nbsp; 这类 HTML 实体，XML 解析会
        // 直接报 parsererror，viewBox 读出来是 0，图就会缩成一条线。
        const holder = document.createElement("div");
        holder.innerHTML = inline;
        const width = holder.querySelector("svg")?.viewBox.baseVal.width ?? 0;

        setDiagram({
          inline,
          full: retag(inline, id),
          width,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  /** span 而非 div：触发按钮里只能放短语内容。正文里的宽度由 --diagram-width 给（见 globals.css）。 */
  const figure = (markup: string) => (
    <span
      className="diagram-figure"
      style={
        { "--diagram-width": diagram ? diagram.width / MERMAID_FONT_SIZE : 0 } as CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );

  return (
    <div className={diagram ? "diagram" : "diagram hidden"}>
      <ZoomViewer label="图表">
        {diagram ? figure(diagram.inline) : <span className="diagram-figure" />}
      </ZoomViewer>
    </div>
  );
}
