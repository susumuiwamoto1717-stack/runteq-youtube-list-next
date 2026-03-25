import Link from "next/link";
import { getVideos, getCategories } from "@/lib/videos";
import { getQuestions } from "@/lib/questions";

export default function Home() {
  const videos = getVideos();
  const categories = getCategories();
  const questions = getQuestions();
  const categoryCounts: Record<string, number> = {};
  videos.forEach((v) => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800">YouTube List</h1>
        <p className="text-gray-500 mt-1">RUNTEQ YouTube動画を自動追跡</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <Stat value={videos.length} label="動画数" color="text-orange-600" />
        <Stat
          value={categories.length}
          label="カテゴリ"
          color="text-green-600"
        />
        <Stat value={questions.length} label="Q&A" color="text-purple-600" />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(categoryCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([cat, count]) => (
            <Link
              key={cat}
              href={`/videos?category=${cat}`}
              className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm hover:bg-orange-50 hover:border-orange-300 transition"
            >
              <span className="font-medium text-gray-700">{cat}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </Link>
          ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-700">最新の動画</h2>
          <Link
            href="/videos"
            className="text-sm text-orange-500 hover:text-orange-700"
          >
            全て見る →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {videos.slice(0, 5).map((video) => (
            <Link
              key={video.video_id}
              href={`/videos/${video.video_id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
            >
              <CategoryBadge category={video.category} />
              <span className="text-sm text-gray-800 flex-1">
                {video.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const c: Record<string, string> = {
    AI: "bg-purple-100 text-purple-700",
    転職: "bg-green-100 text-green-700",
    学習: "bg-amber-100 text-amber-700",
    "Ruby/Rails": "bg-red-100 text-red-700",
    インフラ: "bg-cyan-100 text-cyan-700",
  };
  return (
    <span
      className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${c[category] || "bg-gray-100 text-gray-600"}`}
    >
      {category}
    </span>
  );
}
