import {
  GoalAssessmentObject,
  GoalAssessmentObjectWithIdArray,
  SingleGoalAssessmentWithId,
  gradeDescriptionsObject,
} from "./checking-model";
import { LearningGoals } from "@prisma/client";

const getDummyAnswer = function (
  learningGoal: LearningGoals,
): SingleGoalAssessmentWithId {
  const { goal, id, goalNumber } = learningGoal;
  const dummyAnswer: SingleGoalAssessmentWithId = {
    id,
    goalNumber,
    goal,
    gradeAssigned: "f",
    gradeDescription: gradeDescriptionsObject.f,
    remarks: "No answer provided",
  };
  return dummyAnswer;
};

export const mapGoalsWithResults = function ({
  goals,
  results,
}: {
  goals: LearningGoals[];
  results: GoalAssessmentObject;
}) {
  //console.log("testQuestions", testQuestions);
  //console.log("results", results);

  const resultsWithId = goals.reduce<GoalAssessmentObjectWithIdArray>(
    (acc, goal) => {
      const correspondingResult = results.goalAssessmentResults.find(
        (result) => result.goalNumber === goal.goalNumber,
      );
      if (correspondingResult) {
        acc.push({ ...correspondingResult, id: goal.id });
      } else {
        const dummyAnswer = getDummyAnswer(goal);
        acc.push(dummyAnswer);
      }
      return acc;
    },
    [],
  );

  return resultsWithId;

  //console.log("finalTestResults", resultsWithQuestionID);

  //  Parsing Logic
  // const extendedTestResultSchema = z.object({
  //   results: goalAssessmentSchemaWithIdSchemaArray,
  // });

  // const parsedTestResultsWithQuestionID = extendedTestResultSchema.safeParse({
  //   results: resultsWithQuestionID,
  // });

  // //console.log("parsedTestResults", parsedTestResultsWithQuestionID);

  // if (!parsedTestResultsWithQuestionID.success) {
  //   throw new Error("Parsing failed");
  // }

  // return parsedTestResultsWithQuestionID.data.results;
};
