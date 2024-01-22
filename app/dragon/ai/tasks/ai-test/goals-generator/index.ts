"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  learningGoalsGenerationModel,
  learningGoalObjectSchema,
} from "./model";
import { systemPrompt } from "./template";

export async function generateLearningGoals({ content }: { content: string }) {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const prompt = ChatPromptTemplate.fromMessages([["system", systemPrompt]]);

  try {
    const extractionChain = prompt
      .pipe(learningGoalsGenerationModel)
      .pipe(jsonOutputParser);

    const learningGoals = await extractionChain.invoke({
      content: content,
    });

    const parsedTestResults = learningGoalObjectSchema.safeParse(learningGoals);
    if (!parsedTestResults.success) {
      throw new Error("Parsing failed");
    }
    const goals = parsedTestResults.data.learningGoals;

    return {
      goals,
      error: false,
      message: "Parsing Successful",
    };
  } catch (err) {
    console.error(err);
    return {
      goals: null,
      error: true,
      message: "Can't generate learning goals",
    };
  }
}
