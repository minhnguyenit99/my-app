import {Story} from "@/lib/scraper";
import Link from "next/link";

export async function StoryCard({ story }: { story: Story }) {
    if (!story || !story.title) {
        return <div>No story data available.</div>;
    }
    console.log(`${story.imageUrl} - ${story.title}`);
    return (
        <Link href={`/story/${story.id}`}>
        <article className="border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-500">
          {story.imageUrl && story.imageUrl.startsWith('https') ? (
            <img
              src={story.imageUrl}
              alt={story.title}
              className="w-full sm:w-32 h-32 object-cover rounded-lg shrink-0"
              loading="lazy"
            />
          ):(
            <img
              src='/noimage.png'
              alt={story.title}
              className="w-full sm:w-32 h-32 object-cover rounded-lg shrink-0"
              loading="lazy"
            />)}
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {story.title}
            </h2>
            {story.byline && (
              <p className="text-sm text-gray-500 font-medium mb-2">
                ✍️ {story.byline}
              </p>
            )}
            <p className="text-gray-700 line-clamp-3 text-sm">
              {story.excerpt || "Không có tóm tắt cho bài viết này."}
            </p>
          </div>
        </article>
        </Link>
      );
}