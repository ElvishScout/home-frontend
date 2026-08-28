import { notFound } from "next/navigation";
import { findArticle } from "@/lib/articles";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...slug]">) {
  const { slug } = await params;

  const article = findArticle(slug);
  if (!article) return notFound();

  const Post = (await import(`@/articles/${slug.join("/")}.${article.extension}`)).default;

  return <Post {...article.entry} />;
}
