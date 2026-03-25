import { getVideos, getCategories } from "@/lib/videos";
import VideoList from "./VideoList";

export default function VideosPage() {
  const videos = getVideos();
  const categories = getCategories();

  return <VideoList videos={videos} categories={categories} />;
}
