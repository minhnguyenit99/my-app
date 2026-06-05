import { getTopStories } from "@/lib/queries";
import Link from "next/link";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stories = await getTopStories();
  const story = stories.find((story) => story.id === id);
  if (!story) {
    return <div>Story not found</div>;
  }

  console.log(id);

  return (
    <div>
      <article className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="
      inline-flex items-center gap-2
      mb-8
      text-gray-600
      hover:text-gray-900
      transition-colors
    "
        >
          ← Back
        </Link>
        <header className="mb-10 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            {story.title}
          </h1>

          {story.byline && (
            <p className="mt-5 text-base text-gray-600">
              ✍️ <span className="font-medium">{story.byline}</span>
            </p>
          )}
        </header>

        <div
          className="
      prose
      prose-lg
      lg:prose-xl
      max-w-none

      prose-headings:font-bold
      prose-headings:text-gray-900

      prose-p:text-gray-700
      prose-p:leading-8

      prose-a:text-blue-600
      prose-a:no-underline
      hover:prose-a:underline

      prose-img:rounded-2xl
      prose-img:shadow-lg

      prose-pre:rounded-xl
      prose-blockquote:border-l-4
      prose-blockquote:border-gray-300
      prose-blockquote:italic

      prose-code:text-pink-600
    "
          dangerouslySetInnerHTML={{
            __html: story.content || "",
          }}
        />
      </article>
    </div>
  );
}
