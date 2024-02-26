"use server";
import { getEngineeredMessagesForTest } from "./template";
import { getQuestionTypeName } from "@/app/dragon/teacher/utils";
import { TestContext } from "@/lib/routers/contextRouter/queries";

//TODO - this is a big jugaad, need to fix this, either use LangChain or OpenAI Format, don't mix both
function formatToMarkdown(questions: any[]): string {
  if (!questions) {
    return "";
  }
  return questions
    .map((question, index) => {
      let markdown = `### ${index + 1}. ${question.question}\n`;

      if (question.hint) {
        markdown += `**Hint:** ${question.hint}\n`;
      }
      if (question.options && question.options.length > 0) {
        markdown += `**Options:**\n`;
        question.options.forEach((option: string) => {
          markdown += `- ${option}\n`;
        });
      }
      if (question.question_type) {
        const questionTypeName = getQuestionTypeName(question.question_type);
        markdown += `
        ---\n
        Metadata:\n
        Note: Use it to describe the test. Never directly in th Test.
        **Question Type:${questionTypeName}\n
        `;
      }
      return markdown;
    })
    .join("\n");
}

export async function getEngineeredTestBotMessages(context: TestContext) {
  const { testQuestions: questions, preferences } = context;
  const questionsWitRelevantFields = questions?.map((questionObject) => {
    const { question, question_type, hint, options } = questionObject;

    const result: Partial<typeof questionObject> = { question_type, question };

    if (options && options.length > 0) {
      result.options = options;
    }
    if (hint) {
      result.hint = hint;
    }

    return result;
  });

  const markdownQuestions = formatToMarkdown(
    questionsWitRelevantFields as any[],
  );

  const stringifiedQuestions = JSON.stringify(markdownQuestions ?? "");
  const engineeredMessages = getEngineeredMessagesForTest({
    fullTest: stringifiedQuestions,
    hasEquations: preferences.hasEquations,
  });
  return { engineeredMessages };
}
