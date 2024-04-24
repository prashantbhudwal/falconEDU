"use server";
import { getAITestResultsFromOpenAI } from "./get-results";
import { getCheckingContext } from "./context";
import { mapGoalsWithResults } from "./mapper";
import { getAITestFeedback } from "./get-feedback";

export async function checkAITest({ botChatId }: { botChatId: string }) {
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

  const studentFeedback = await getAITestFeedback({
    report: finalTestResults,
  });

  return { finalTestResults, studentFeedback };
}
