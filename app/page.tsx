import { StoryCard } from "@/app/components/StoryCard";
import { getTopStories } from "@/lib/queries";

export default async function Home() {
  const stories = await getTopStories();
  console.log(stories.length);
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-2">
          Hacker News Top Stories
        </h1>
      </header>

      <div className="flex flex-col gap-6">
        {stories.length === 0 ? (
          <p className="text-gray-500 italic">We are processing articles</p>
        ) : (
          stories.map((story) => <StoryCard key={story.id} story={story} />)
        )}
      </div>
    </main>
  );
}