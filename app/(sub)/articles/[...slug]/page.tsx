import { notFound } from "next/navigation";
import registry from "virtual:mdx-registry";
import { slugToRegistryKey } from "@/lib/articles";

export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/articles/[...slug]">) {
  const { slug } = await params;

  const path = slugToRegistryKey(slug);
  const entry = registry[path];

  let Post;
  try {
    Post = (await import(`@/articles/${slug.join("/")}.mdx`)).default;
  } catch {
    return notFound();
  }

  return <Post {...entry} />;
}
