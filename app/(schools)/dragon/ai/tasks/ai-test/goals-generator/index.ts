"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  learningGoalsGenerationModel,
  learningGoalObjectSchema,
} from "./model";
import { systemPrompt } from "./template";

export async function generateLearningGoalsWithAI({
  content,
}: {
  content: string;
}) {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const prompt = ChatPromptTemplate.fromMessages([["system", systemPrompt]]);

  const extractionChain = prompt
    .pipe(learningGoalsGenerationModel)
    .pipe(jsonOutputParser);

  const learningGoals = await extractionChain.invoke({
    content: content,
  });
  if (!learningGoals) {
    throw new Error("Oops! Something went wrong. Please try again.");
  }

  const parsedTestResults = learningGoalObjectSchema.safeParse(learningGoals);
  if (!parsedTestResults.success) {
    throw new Error(
      "AI failed to learn from the given content. Please try again.",
    );
  }
  const goals = parsedTestResults.data.learningGoals;

  if (goals && goals.length === 0) {
    throw new Error(
      "No goals could be generated from the given content. Please try updating the content.",
    );
  }

  return goals;
}
