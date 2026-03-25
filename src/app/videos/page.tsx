import Link from "next/link";
import { getVideos, getCategories } from "@/lib/videos";

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  let videos = getVideos();
  const categories = getCategories();

  if (params.category)
    videos = videos.filter((v) => v.category === params.category);
  if (params.search)
    videos = videos.filter((v) => v.title.includes(params.search!));

  const c: Record<string, string> = {
    AI: "bg-purple-100 text-purple-700",
    転職: "bg-green-100 text-green-700",
    学習: "bg-amber-100 text-amber-700",
    "Ruby/Rails": "bg-red-100 text-red-700",
    インフラ: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">YouTube List</h1>
        <form className="flex gap-2">
          <input
            name="search"
            defaultValue={params.search}
            placeholder="タイトルで検索..."
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
          <button className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-md hover:bg-orange-600 cursor-pointer transition">
            検索
          </button>
        </form>
      </div>
      <div className="flex flex-wrap gap-1">
        <Link
          href="/videos"
          className={`text-xs px-3 py-1 rounded-full border transition ${!params.category ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"}`}
        >
          全て
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/videos?category=${cat}`}
            className={`text-xs px-3 py-1 rounded-full border transition ${params.category === cat ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"}`}
          >
            {cat}
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            {videos.length}件の動画
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {videos.map((video, i) => (
            <div
              key={video.video_id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition group"
            >
              <span className="shrink-0 text-xs text-gray-400 w-6 text-right">
                {i + 1}
              </span>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${c[video.category] || "bg-gray-100 text-gray-600"}`}
              >
                {video.category}
              </span>
              <Link
                href={`/videos/${video.video_id}`}
                className="flex-1 text-sm text-gray-800 hover:text-orange-600 transition"
              >
                {video.title}
              </Link>
              {video.published_at && (
                <span className="shrink-0 text-xs text-gray-400 w-20 text-right">
                  {new Date(video.published_at).toLocaleDateString("ja-JP")}
                </span>
              )}
              <a
                href={video.url}
                target="_blank"
                rel="noopener"
                className="shrink-0 text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
              >
                ▶
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
