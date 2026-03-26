import rawVideos from "../runteq_videos.json";
import videoDates from "../video_dates.json";
import fs from "fs";
import path from "path";

export type Video = {
  video_id: string;
  title: string;
  url: string;
  category: string;
  published_at: string | null;
};

const CATEGORIES: Record<string, string[]> = {
  AI: [
    "AI",
    "生成AI",
    "ChatGPT",
    "Claude",
    "Copilot",
    "LLM",
    "プロンプト",
    "Vibe",
  ],
  転職: [
    "転職",
    "キャリア",
    "年収",
    "採用",
    "面接",
    "就職",
    "フリーランス",
    "副業",
  ],
  学習: ["学習", "勉強", "入門", "初心者", "技術書", "Udemy", "ロードマップ"],
  "Ruby/Rails": ["Ruby", "Rails"],
  インフラ: ["インフラ", "サーバー", "Docker", "AWS", "CS"],
};

const dates: Record<string, string | null> = videoDates as Record<
  string,
  string | null
>;

// 切り抜き除外前の2025-2026年フル動画の本数
const MAX_VIDEOS = 135;

function extractVideoId(url: string): string {
  try {
    const u = new URL(url);
    return u.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function categorize(title: string): string {
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((kw) => title.includes(kw))) return cat;
  }
  return "その他";
}

// ビルド時に1回だけ計算してキャッシュ
let _cachedVideos: Video[] | null = null;

export function getVideos(): Video[] {
  if (_cachedVideos) return _cachedVideos;

  const videos: Video[] = (
    rawVideos as { title: string; url: string; meta?: string }[]
  )
    .slice(0, MAX_VIDEOS)
    .filter((v) => !v.title.includes("切り抜き"))
    .map((v) => {
      const vid = extractVideoId(v.url);
      return {
        video_id: vid,
        title: v.title,
        url: v.url,
        category: categorize(v.title),
        published_at: dates[vid] ?? null,
      };
    })
    .sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });

  _cachedVideos = videos;
  return videos;
}

export function getVideo(videoId: string): Video | undefined {
  return getVideos().find((v) => v.video_id === videoId);
}

export function hasInfographic(videoId: string): boolean {
  return fs.existsSync(
    path.join(process.cwd(), "public", "infographics", `${videoId}.png`),
  );
}

export function getCategories(): string[] {
  const cats = new Set(getVideos().map((v) => v.category));
  return Array.from(cats).sort();
}
