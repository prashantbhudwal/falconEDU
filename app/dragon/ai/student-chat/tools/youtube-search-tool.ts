import axios from "axios";
import * as z from "zod";
import { FunctionDefinition, ToolWithCallback, toolName } from "./types";
import { zodSchemaToOpenAIParameters } from "../utils";
import { ChatCompletionTool } from "openai/resources";

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
    console.log("response", response);
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
      "The search query for finding a video on YouTube. Video will be from Khan Academy."
    ),
});

export const youtubeSearchFunction: FunctionDefinition = {
  name: "search_youtube_video",
  description:
    "Search for a Khan Academy YouTube video when user asks for a video. Show the video in the chat.",
  parameters: zodSchemaToOpenAIParameters(schema),
};

export const youtubeSearch: ToolWithCallback = {
  name: "search_youtube_video",
  tool: {
    type: "function",
    function: youtubeSearchFunction,
  },
  callback: searchYouTubeVideo,
};

export function findToolByName(name: toolName): ToolWithCallback | undefined {
  const tools: ToolWithCallback[] = [youtubeSearch];
  return tools.find((tool) => tool.name === name);
}
