import Link from "next/link";
import { getVideo, getVideos, hasInfographic } from "@/lib/videos";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getVideos().map((v) => ({ id: v.video_id }));
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideo(id);
  if (!video) notFound();

  const showInfographic = hasInfographic(id);
  const c: Record<string, string> = {
    AI: "bg-purple-100 text-purple-700",
    転職: "bg-green-100 text-green-700",
    学習: "bg-amber-100 text-amber-700",
    "Ruby/Rails": "bg-red-100 text-red-700",
    インフラ: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="space-y-6">
      <Link
        href="/videos"
        className="text-sm text-orange-500 hover:text-orange-700"
      >
        ← 一覧に戻る
      </Link>
      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={`https://www.youtube.com/embed/${video.video_id}`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h1 className="text-xl font-bold text-gray-800">{video.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${c[video.category] || "bg-gray-100 text-gray-600"}`}
          >
            {video.category}
          </span>
          <a
            href={video.url}
            target="_blank"
            rel="noopener"
            className="text-xs text-orange-500 hover:text-orange-700"
          >
            YouTubeで見る
          </a>
        </div>
      </div>
      {showInfographic && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-bold text-gray-700 mb-3">
            📊 インフォグラフィック
          </h2>
          <img
            src={`/infographics/${video.video_id}.png`}
            alt={`${video.title} インフォグラフィック`}
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
