import { getPrompt } from "@/app/utils";
import { NextResponse, NextRequest } from "next/server";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const topic = body.topic;
  const subtopic = body.subtopic;
  const grade = body.grade;
  const promptType = body.promptType;
  const prompt = getPrompt(promptType);

  const openai = new OpenAIApi(configuration);
  async function fetchCompletion() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable teaching assistant. I am a teacher in India teaching grade ${grade} at an NCERT school, focusing on the topic "${topic}" under the subtopic "${subtopic}". My students' primary language is not English. Help me brainstorm ideas and strategies for effectively teaching this topic in my classroom.`,
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
