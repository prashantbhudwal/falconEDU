import { z } from "zod";
import {
  TestResultsObject,
  testResultObjectWithIdSchema,
  type TestResultObjectWithIdArray,
  type SingleTestResultWithID,
} from "../tool";
import { parsedQuestions } from "@prisma/client";
import { UpdatedQuestionType } from "@/app/dragon/types";

const getDummyAnswer = function (
  testQuestion: parsedQuestions
): SingleTestResultWithID {
  const {
    question_number,
    question_type,
    hint,
    correct_answer,
    sample_answer,
    max_score,
    question: questionText,
    options,
    id,
  } = testQuestion;

  let dummyAnswer: SingleTestResultWithID = {
    id,
    question_number,
    question_type: question_type as UpdatedQuestionType,
    correct_answer,
    isCorrect: false,
    student_answer: [],
    question: questionText,
    hint: hint || undefined,
    sample_answer: sample_answer || undefined,
    max_score: max_score || undefined,
    options: options,
  };

  return dummyAnswer;
};

export const mapQuestionsWithResults = function ({
  testQuestions,
  results,
}: {
  testQuestions: parsedQuestions[];
  results: TestResultsObject;
}) {
  //console.log("testQuestions", testQuestions);
  //console.log("results", results);

  const resultsWithQuestionID =
    testQuestions.reduce<TestResultObjectWithIdArray>((acc, question) => {
      const correspondingResult = results.results.find(
        (result) => result.question_number === question.question_number
      );
      if (correspondingResult) {
        acc.push({ ...correspondingResult, id: question.id });
      } else {
        const dummyAnswer = getDummyAnswer(question);
        acc.push(dummyAnswer);
      }
      return acc;
    }, []);

  //console.log("finalTestResults", resultsWithQuestionID);

  //  Parsing Logic
  const extendedTestResultSchema = z.object({
    results: testResultObjectWithIdSchema,
  });

  const parsedTestResultsWithQuestionID = extendedTestResultSchema.safeParse({
    results: resultsWithQuestionID,
  });

  //console.log("parsedTestResults", parsedTestResultsWithQuestionID);

  if (!parsedTestResultsWithQuestionID.success) {
    throw new Error("Parsing failed");
  }

  return parsedTestResultsWithQuestionID.data.results;
};

// Recommended by GPT
// import { z } from "zod";
// import {
//   TestResultsAnswerSchema,
//   TestResultsObject,
//   testResultObjectWithIdSchema,
//   type TestResultObjectWithIdArray,
//   type SingleTestResultWithID,
// } from "../tool";
// import { parsedQuestions } from "@prisma/client";

// const getDummyAnswer = (
//   testQuestion: parsedQuestions
// ): SingleTestResultWithID => {
//   // ... existing implementation ...
// };

// const createResultsLookup = (results: TestResultsObject) => {
//   const lookup = new Map();
//   results.results.forEach((result) => {
//     lookup.set(result.question_number, result);
//   });
//   return lookup;
// };

// export const mapQuestionsWithResults = ({
//   testQuestions,
//   results,
// }: {
//   testQuestions: parsedQuestions[];
//   results: TestResultsObject;
// }) => {
//   const resultsLookup = createResultsLookup(results);

//   const finalTestResults = testQuestions.map((question) => {
//     const correspondingResult = resultsLookup.get(question.question_number);
//     return correspondingResult
//       ? { ...correspondingResult, id: question.id }
//       : getDummyAnswer(question);
//   });

//   const extendedTestResultSchema = z.object({
//     results: testResultObjectWithIdSchema,
//   });

//   const parsedTestResults = extendedTestResultSchema.safeParse({
//     results: finalTestResults,
//   });

//   if (!parsedTestResults.success) {
//     // Enhanced error reporting
//     throw new Error(`Parsing failed: ${parsedTestResults.error}`);
//   }

//   return parsedTestResults.data.results;
// };
