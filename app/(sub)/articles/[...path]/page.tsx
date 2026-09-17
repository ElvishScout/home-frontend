import { notFound } from "next/navigation";
import components from "virtual:mdx-components";
import { pathToRegistryKey } from "@/lib/articles";
import registry from "virtual:mdx-registry";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...path]">) {
  const { path } = await params;
  const entry = registry[pathToRegistryKey(path)];
  if (!entry) return notFound();

  // import 路径必须静态：含变量的动态 import 会被 Turbopack 拒绝，
  // import.meta.glob 跨目录引用服务端组件也有已知 bug。
  // 静态 import 映射由构建期生成（virtual:mdx-components），key 与 registry 一致。
  const Post = (await components[pathToRegistryKey(path)]()).default;

  return <Post {...entry} />;
}
