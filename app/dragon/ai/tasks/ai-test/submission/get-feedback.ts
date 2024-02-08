import { ChatPromptTemplate } from "langchain/prompts";
import { systemTemplateForStudentFeedback } from "./template";

import {
  giveFeedbackModel,
  studentFeedbackObjectSchema,
} from "./feedback-model";

import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export const getAITestFeedback = async function ({ report }: { report: any }) {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const promptForFeedbackGeneration = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForStudentFeedback],
  ]);

  const feedbackGenerationChain = promptForFeedbackGeneration
    .pipe(giveFeedbackModel)
    .pipe(jsonOutputParser);

  const feedback = await feedbackGenerationChain.invoke({
    report: JSON.stringify(report),
  });

  const parsedResults = studentFeedbackObjectSchema.safeParse(feedback);

  if (!parsedResults.success) {
    console.error("Error parsing test results:", parsedResults.error);
    throw new Error("Error parsing test results");
  }

  return parsedResults.data.feedback;
};
