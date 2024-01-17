import axios from "axios";

export async function searchYouTubeVideo(
  query: string,
  channelId = "UC4a-Gbdw7vOaccHmFo40b9g", // Default set to Khan Academy's Channel ID
  maxResults = 5,
  order = "relevance"
) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: channelId, // Added channelId to the request parameters
          q: query,
          maxResults: maxResults,
          order: order,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during YouTube API call:", error);
    throw error;
  }
}

export const youtubeSearchTool = {
  name: "search_youtube_video",
  description:
    "Search for a Khan Academy YouTube video based on a user's query",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "The search query for finding a video on YouTube. Video will be from Khan Academy.",
      },
    },
    required: ["query", "apiKey"],
  },
};


