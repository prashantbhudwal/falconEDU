import { StreamPayload } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
import { processIdeas, generateMarkdown } from "@/app/(schools)/api/lib/utils";

interface Idea {
  ideaType: string;
  text: string;
}

export default function getLessonPlanMessages(payload: StreamPayload) {
  const { topic, subtopics, grade, prompt, board, subject } = payload;

  const ideasArray = JSON.parse(prompt);
  const newArray = processIdeas(ideasArray);
  const ideas = generateMarkdown(newArray);
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching expert that creates lesson plans. I will give you '''CONTENT IDEAS''',  '''STUDENT DETAILS''', '''LESSON PLAN SCOPE''' and you will give me a lesson plan according to the '''RULES'''. 
      
      ## STUDENT DETAILS
      - Grade: "${grade}"
      - Subject: "${subject}"
      - School Board follows "${board}" textbooks. 
      - Students live in "India".

      ## LESSON PLAN SCOPE
      - Chapter: "${topic}"
      - Topics: "${subtopics}"
      
      ## CONTENT IDEAS
      '''${ideas}'''.
      `,
    },
    {
      role: "user",
      content: `Give me a lesson plan. 
      ## RULES:
      - Start with Objectives, no need to give the subject and topic.
      - Only use ideas to generate the plan.
      - IF certain "Topics" are in "LESSON PLAN SCOPE" but you don't find content for them in "CONTENT IDEAS", SKIP them from the plan and the objectives.
      - My students' primary language is not English.
      - Only give the lesson plan and nothing else.
      `,
    },
  ];
  return messages;
}
