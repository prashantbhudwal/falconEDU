import { testBotPreferencesSchema } from "@/app/dragon/schema";
import {
  getTestChatContextByChatId,
  isEmptyObject,
} from "@/app/dragon/student/api/chat/queries";
import { z } from "zod";
import { Message } from "ai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { zodToJsonSchema } from "zod-to-json-schema";

const messageTemplates = {
  systemTemplate: `
  - You are a '''test evaluator''. You check the questions from the TEST, one by one, and give a report of the answers. What follows are a set of '''INSTRUCTIONS'' , '''TEST''' and '''ANSWERS'''.  

'''INSTRUCTIONS''':
  - DON't talk about anything but the '''TEST''', in any context.
  - You ARE only allowed to ask the questions. 
  - DON'T answer the questions, in any context. 
  - DON'T give any hints, in any context.
  - DON'T give any feedback, in any context, while the TEST is not complete.
  - ONLY give feedback after the TEST is over.

'''TEST''': 
  {fullTest}

'''ANSWERS''':
  {answers}

return a report for this test
`,
};

export async function getTestResultEngineeredMessage(
  botChatId: string,
  answers: Message[]
) {
  const context = await getTestChatContextByChatId(botChatId);

  if (!context) {
    console.error("context not found for chatId:");
  }

  if (
    !isEmptyObject(context?.teacherPreferences) ||
    context?.teacherPreferences === undefined
  ) {
    throw new Error("no test found for chatId");
  }
  const teacherName = context?.teacherName;
  const studentName = context?.studentName;

  let testBotPreferences = context?.botPreferences as z.infer<
    typeof testBotPreferencesSchema
  >;

  const { fullTest } = testBotPreferences;
  const { systemTemplate } = messageTemplates;

  const chatPrompt = ChatPromptTemplate.fromPromptMessages<
    z.infer<typeof testBotPreferencesSchema>
  >([SystemMessagePromptTemplate.fromTemplate(systemTemplate)]);

  const engineeredMessages = await chatPrompt.formatMessages({
    fullTest: fullTest,
    answers: JSON.stringify(answers),
    studentName: studentName,
    teacherName: teacherName,
  });
  return engineeredMessages;
}

const zodReportSchema = z.object({
  report: z.array(
    z.object({
      question_number: z.number().describe("Question number of the test"),
      student_answer: z.string().describe("Answer provided by the user"),
      correct_answer: z.string().describe("Correct answer of the question"),
      isCorrect: z
        .boolean()
        .describe("If the user answer and correct answer is equal"),
    })
  ),
});

async function structuredTestReport(unstructuredReport: string) {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0613",
    temperature: 0,
  }).bind({
    functions: [
      {
        name: "Report",
        description: "Extracts details from the report",
        parameters: zodToJsonSchema(zodReportSchema),
      },
    ],
    function_call: { name: "Report" },
  });

  const structuredReport = await model.invoke(unstructuredReport);

  return JSON.parse(
    structuredReport.lc_kwargs.additional_kwargs.function_call.arguments
  );
}

export default async function testResult(
  botChatId: string,
  messages: Message[]
) {
  const testResultEngineeredMessage = await getTestResultEngineeredMessage(
    botChatId,
    messages
  );
  const llm = new ChatOpenAI({
    streaming: true,
  });

  const array = [...testResultEngineeredMessage];

  try {
    const response = await llm._generate(array, {});
    const result = await structuredTestReport(response.generations[0].text);

    return result;
  } catch (err) {
    throw new Error("Can't generate report");
  }
}
