import { NextResponse } from "next/server";
import sources from "virtual:mdx-source";
import { pathToRegistryKey } from "@/lib/articles";

export async function GET(_request: Request, { params }: RouteContext<"/raw/articles/[...path]">) {
  const { path } = await params;
  const source = sources[pathToRegistryKey(path)];
  if (source === undefined) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(source, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
