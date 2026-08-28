import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "./components/mermaid-diagram";

export function useMDXComponents(): MDXComponents {
  return {
    MermaidDiagram,
  };
}
