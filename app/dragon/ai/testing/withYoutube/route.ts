import { OpenAIStream, StreamingTextResponse } from "ai";
import axios from "axios";
import OpenAI from "openai";
import type { ChatCompletionCreateParams } from "openai/resources/chat";

async function searchYouTubeVideo(
  query: string,
  maxResults = 5,
  order = "relevance",
) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          maxResults: maxResults,
          order: order,
          key: process.env.GOOGLE_API_KEY,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error during YouTube API call:", error);
    throw error;
  }
}

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Function definition:
const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "search_youtube_video",
    description: "Search for a YouTube video based on a user's query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query for finding a video on YouTube",
        },
        maxResults: {
          type: "integer",
          description: "The maximum number of search results to return",
          default: 5,
        },
        order: {
          type: "string",
          enum: [
            "date",
            "rating",
            "relevance",
            "title",
            "videoCount",
            "viewCount",
          ],
          description: "The order to display search results",
          default: "relevance",
        },
        apiKey: {
          type: "string",
          description: "API key for accessing YouTube Data API",
        },
      },
      required: ["query", "apiKey"],
    },
  },
];

// And use it like this:
export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    stream: true,
    messages,
    functions,
  });
  console.log(response);

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      // if you skip the function call and return nothing, the `function_call`
      // message will be sent to the client for it to handle
      console.log("function call", name, args);
      if (name === "search_youtube_video") {
        const video = await searchYouTubeVideo(args.query as string);
        console.log(video);
        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(video);
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: "gpt-3.5-turbo-0613",
          // see "Recursive Function Calls" below
          functions,
        });
      }
    },
  });
  console.log(stream);

  return new StreamingTextResponse(stream);
}
