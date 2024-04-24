import axios from "axios";
import * as z from "zod";
import { createToolWithCallback } from "../tool-creator";

const KHAN_ACADEMY_CHANNEL_ID = "UC4a-Gbdw7vOaccHmFo40b9g";
const MAX_RESULTS = 3;
const YOUTUBE_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";

export async function searchYouTubeVideo({ query }: { query: string }) {
  try {
    const response = await axios.get(YOUTUBE_ENDPOINT, {
      params: {
        part: "snippet",
        channelId: KHAN_ACADEMY_CHANNEL_ID,
        q: query,
        maxResults: MAX_RESULTS,
        order: "relevance",
        key: process.env.GOOGLE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during YouTube API call:", error);
    throw error;
  }
}

const schema = z.object({
  query: z
    .string()
    .describe(
      "The search query for finding a video on YouTube. Video will be from Khan Academy.",
    ),
});

export const youtubeSearch = createToolWithCallback({
  name: "search_youtube_video",
  description:
    "Search for a Khan Academy YouTube video when user asks for a video. Show the video in the chat.",
  schema,
  callback: searchYouTubeVideo,
  type: "function",
});
