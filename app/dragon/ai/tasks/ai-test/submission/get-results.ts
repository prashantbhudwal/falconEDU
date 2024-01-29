import { ChatPromptTemplate } from "langchain/prompts";
import { systemTemplateForChecking } from "./template";
import { gradeLearningGoalsModel, goalAssessmentObjectSchema } from "./model";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { mapMessagesToLangChainBaseMessage } from "../../../student-chat/utils";

export const getAITestResultsFromOpenAI = async function ({
  goals,
  messages,
}: {
  goals: any;
  messages: any;
}) {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const messagesWithLangChainBaseMessage =
    mapMessagesToLangChainBaseMessage(messages);

  const promptForTestChecking = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForChecking],
    ...messagesWithLangChainBaseMessage,
  ]);
  const testCheckingChain = promptForTestChecking
    .pipe(gradeLearningGoalsModel)
    .pipe(jsonOutputParser);

  const results = await testCheckingChain.invoke({
    goals: JSON.stringify(goals),
  });

  const parsedResults = goalAssessmentObjectSchema.safeParse(results);

  if (!parsedResults.success) {
    console.error("Error parsing test results:", parsedResults.error);
    throw new Error("Error parsing test results");
  }

  return parsedResults.data;
};
