import { notFound } from "next/navigation";
import components from "virtual:mdx-components";
import { findArticle, slugToRegistryKey } from "@/lib/articles";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...slug]">) {
  const { slug } = await params;

  const article = findArticle(slug);
  if (!article) return notFound();

  // import 路径必须静态：含变量的动态 import 会被 Turbopack 拒绝，
  // import.meta.glob 跨目录引用服务端组件也有已知 bug。
  // 静态 import 映射由构建期生成（virtual:mdx-components），key 与 registry 一致。
  const Post = (await components[slugToRegistryKey(slug, article.extension)]()).default;

  return <Post {...article.entry} />;
}
