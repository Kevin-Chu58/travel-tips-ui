import http from "@services/http";

export type YouTubeVideo = {
  title: string;
  videoId: string;
  thumbnailUrl: string;
  publishedAt: Date;
};

export type YouTubeChannel = {
  id: string;
  title: string;
  thumbnailUrl: string;
  customUrl?: string;
  videos: YouTubeVideo[];
};

const getGospelYouTubeFeed = async (): Promise<YouTubeChannel[]> => {
  return await http.get(http.apiBaseURLs.api, "youTubeFeeds", undefined);
};

export const youTubeFeedsService = {
  getGospelYouTubeFeed,
};
