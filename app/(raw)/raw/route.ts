import { NextResponse } from "next/server";
import registry from "virtual:mdx-registry";

export async function GET(_request: Request, { params }: RouteContext<"/raw">) {
  return NextResponse.json(registry);
}
