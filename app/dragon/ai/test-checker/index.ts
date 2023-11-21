"use server";
import { getTestResultsFromOpenAI } from "./get-test-results";
import { getCheckingContext } from "./lib";
import { mapQuestionsWithResults } from "./lib";

export async function checkTest(testBotId: string) {
  try {
    const context = await getCheckingContext(testBotId);
    if (!context) {
      throw new Error("Test not found");
    }
    const { testQuestions, messages } = context;

    console.log("testQuestions", testQuestions);
    console.log("messages", messages);

    const results = await getTestResultsFromOpenAI({
      testQuestions,
      messages,
    });

    console.log("testResults", results);

    // Error
    const finalTestResults = mapQuestionsWithResults({
      testQuestions,
      results,
    });

    return finalTestResults;
  } catch (err) {
    console.error(err);
  }
}
