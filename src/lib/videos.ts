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

const dates = videoDates as Record<string, string | null>;

function categorize(title: string): string {
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((kw) => title.includes(kw))) return cat;
  }
  return "その他";
}

export function getVideos(): Video[] {
  const videos: Video[] = (
    rawVideos as { title: string; url: string; meta?: string }[]
  )
    .slice(0, 134)
    .filter((v) => !v.title.includes("切り抜き"))
    .map((v) => {
      const vid = v.url.split("watch?v=").pop()?.split("&")[0] || "";
      return {
        video_id: vid,
        title: v.title,
        url: v.url,
        category: categorize(v.title),
        published_at: dates[vid] || null,
      };
    });

  // 日付の新しい順にソート
  videos.sort((a, b) => {
    if (!a.published_at && !b.published_at) return 0;
    if (!a.published_at) return 1;
    if (!b.published_at) return -1;
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });

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
