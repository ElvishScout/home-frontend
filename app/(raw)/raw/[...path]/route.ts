import { NextResponse } from "next/server";
import sources from "virtual:mdx-source";

export async function GET(_request: Request, { params }: RouteContext<"/raw/[...path]">) {
  const { path } = await params;
  const source = sources[path.join("/")];
  if (source === undefined) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(source, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
