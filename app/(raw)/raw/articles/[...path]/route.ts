import { NextResponse } from "next/server";
import sources from "virtual:mdx-source";
import { findArticle, pathToRegistryKey } from "@/lib/articles";

export async function GET(_request: Request, { params }: RouteContext<"/raw/articles/[...path]">) {
  const { path } = await params;
  const found = findArticle(path);
  if (!found) return new NextResponse("Not Found", { status: 404 });

  const source = sources[pathToRegistryKey(path, found.extension)];
  return new NextResponse(source, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
