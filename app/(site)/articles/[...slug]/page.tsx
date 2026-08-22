import { notFound } from "next/navigation";
import registry from "virtual:mdx-registry";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...slug]">) {
  const { slug } = await params;

  const path = `articles/${slug.join("/")}.mdx`;
  const entry = registry[path];

  let Post;
  try {
    Post = (await import(`@/${path}`)).default;
  } catch {
    return notFound();
  }

  return <Post {...entry} />;
}
