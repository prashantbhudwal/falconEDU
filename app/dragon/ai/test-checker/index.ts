"use server";
import { getTestResultsFromOpenAI } from "./get-test-results";
import { getCheckingContext } from "./lib";
import { mapQuestionsWithResults } from "./lib";

export async function checkTest({ botChatId }: { botChatId: string }) {
  try {
    const context = await getCheckingContext({
      botChatId,
    });
    if (!context) {
      throw new Error("Test not found");
    }
    const { testQuestions, messages } = context;

    const results = await getTestResultsFromOpenAI({
      testQuestions,
      messages,
    });

    const finalTestResults = mapQuestionsWithResults({
      testQuestions,
      results,
    });

    return finalTestResults;
  } catch (err) {
    console.error(err);
  }
}
