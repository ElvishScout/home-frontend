import { notFound } from "next/navigation";
import { findArticle } from "@/lib/articles";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...slug]">) {
  const { slug } = await params;

  const article = findArticle(slug);
  if (!article) return notFound();

  // 扩展名必须静态写死：动态 import 的模板若含变量扩展名，打包器会把
  // articles/ 整目录（含 .html 等非模块文件）收进 context module，构建即报错。
  const Post = (
    article.extension === "md"
      ? await import(`@/articles/${slug.join("/")}.md`)
      : await import(`@/articles/${slug.join("/")}.mdx`)
  ).default;

  return <Post {...article.entry} />;
}
