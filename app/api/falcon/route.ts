import { getPrompt } from "@/app/utils";
import { NextResponse, NextRequest } from "next/server";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const topic = body.topic;
  const promptType = body.promptType;
  const prompt = getPrompt(promptType);

  const openai = new OpenAIApi(configuration);
  async function fetchCompletion() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Your name is FalconOne. I am a student in grade 6 and english is my second language.",
        },
        {
          role: "user",
          content: `${prompt}: ${topic}`,
        },
      ],
    });
    return completion.data;
  }

  const openAIresponse = await fetchCompletion();

  const response = { ...openAIresponse, topic, promptType };

  return NextResponse.json({ response });
}
