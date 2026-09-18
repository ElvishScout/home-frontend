import type { MDXComponents } from "mdx/types";
import { ImageViewer } from "./components/image-viewer";
import { MermaidDiagram } from "./components/mermaid-diagram";

export function useMDXComponents(): MDXComponents {
  return {
    MermaidDiagram,
    ImageViewer,
  };
}
