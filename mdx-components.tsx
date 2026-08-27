import type { MDXComponents } from "mdx/types";
import { MdxWrapper } from "./components/mdx-wrapper";

export function useMDXComponents(): MDXComponents {
  return {
    wrapper: MdxWrapper,
  };
}
