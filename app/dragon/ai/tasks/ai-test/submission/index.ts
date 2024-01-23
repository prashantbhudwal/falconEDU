"use server";
import { getAITestResultsFromOpenAI } from "./get-results";
import { getCheckingContext } from "./context";
import { mapGoalsWithResults } from "./mapper";

export async function checkAITest({ botChatId }: { botChatId: string }) {
  try {
    const context = await getCheckingContext(botChatId);

    if (!context) {
      throw new Error("Test not found");
    }
    const { goals, messages } = context;

    const results = await getAITestResultsFromOpenAI({
      goals,
      messages,
    });

    const finalTestResults = mapGoalsWithResults({
      goals,
      results,
    });

    return finalTestResults;
  } catch (err) {
    console.error(err);
  }
}
