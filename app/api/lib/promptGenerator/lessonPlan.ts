import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
interface Idea {
  ideaType: string;
  text: string;
}
function generateGptPrompt(ideas: Idea[]): string {
  const promptText = ideas.reduce((acc, idea) => {
    // Add a separator between ideas
    if (acc.length > 0) {
      acc += "\n\n";
    }
    // Add the idea type as a heading
    acc += `## ${idea.ideaType}\n\n`;
    // Add the idea text as a paragraph
    acc += `${idea.text}\n`;
    return acc;
  }, "");

  return `ideas:\n\n${promptText}`;
}

export default function getLessonPlanMessages(payload: StreamPayload){
    const { topic, subtopic, grade, data, payloadType } = payload;
    const newArray = data.map((obj: any) => ({
        ideaType: obj.type,
        text: obj.text.join(" "),
    }));
    const ideas = generateGptPrompt(newArray);
    
    const messages: ChatCompletionRequestMessage[] = [
        {
        role: "system",
        content: `You are a knowledgeable teaching expert. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
        },
        {
        role: "user",
        content: `Give me a lesson plan. Make SURE that you use these ${ideas}. And start with Objectives, no need to give the subject and topic.`,
        },
    ];
    return messages;
}