import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processIdeas, generateMarkdownWithoutQuiz } from "@/app/api/lib/utils";

interface Idea {
  ideaType: string;
  text: string;
}

export default function getShortVideoScriptMessages(payload: StreamPayload) {
  const { topic, subtopic, grade, data, board, subject } = payload;
  const newArray = processIdeas(data);
  const ideas = generateMarkdownWithoutQuiz(newArray);
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a video script writer. I am a teacher in India teaching grade ${grade} ${subject} at a school that follows "${board}" textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English. I will give you some ideas and you give me a video script. Start your response with "Short Video Script:".`,
    },
    {
      role: "user",
      content: `Give script for a 3 minute video for my children in the style of Kurzgesagt. Make it fun and engaging. Also remember that I will be recording this video on my phone'e selfie camera. So, no use of any graphics or animations. The whole video will be in one shot, so no cuts because no editors will be used in post. Make SURE that you use some or all of these ${ideas}.`,
    },
  ];
  return messages;
}
