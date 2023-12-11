import { cache } from "react";
import { AllStudentResponsesByBotConfigId } from "./(tasks)/[taskId]/test/queries";
import prisma from "@/prisma";
import { ConditionalPromptSelector } from "langchain/prompts";
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
/**
 * Calculates the test metadata based on the given student responses.
 *
 * @param {AllStudentResponsesByBotConfigId} allStudentResponses - The student responses for all bot configurations.
 * @return {Object} - An object containing the maximum score, highest score, least score, and average score.
 */
export const getTestMetadata = (
  allStudentResponses: AllStudentResponsesByBotConfigId
) => {
  let allStudentScore;
  let maxScore = 0;
  let leastScore = 0;
  let highestScore = 0;
  let averageScore = 0;

  if (Array.isArray(allStudentResponses) && allStudentResponses.length > 0) {
    allStudentScore = allStudentResponses.map((response) => {
      maxScore = response.BotChatQuestions.length;
      return response.BotChatQuestions.filter((question) => question.isCorrect)
        .length;
    });
    leastScore = allStudentScore.reduce((acc, curr) =>
      acc > curr ? curr : acc
    );
    highestScore = allStudentScore.reduce((acc, curr) =>
      acc < curr ? curr : acc
    );

    const totalCorrect = allStudentScore.reduce((acc, curr) => acc + curr, 0);

    // calculate the average number of correct answers
    const numberOfStudents = allStudentScore.length;
    averageScore = +(totalCorrect / numberOfStudents).toFixed(1);
  }
  //console.log(maxScore, highestScore, leastScore, averageScore);
  return { maxScore, highestScore, leastScore, averageScore };
};

// ----------------------------------------------------------------------------------

export const getProgressBarColor = (percentageValue: number) => {
  if (percentageValue < 40) {
    return "bg-red-500";
  }
  if (percentageValue < 70 && percentageValue >= 40) {
    return "bg-orange-400";
  }
  if (percentageValue <= 100 && percentageValue >= 70) {
    return "bg-green-400";
  } else {
    return "bg-orange-400";
  }
};

export const getQuestionTypeName = (questionType: string) => {
  const words = questionType
    .split("_")
    .join(" ")
    .toLocaleLowerCase()
    .split(" ");

  const name = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return name;
};

export const getTaskIcon = (taskType: string) => {
  switch (taskType) {
    case "chat":
      return {
        Icon: AcademicCapIcon,
        iconColor: "text-primary",
      };
    case "test":
      return {
        Icon: ClipboardDocumentCheckIcon,
        iconColor: "text-secondary",
      };
    default:
      return {
        Icon: AcademicCapIcon,
        iconColor: "text-blue-500",
      };
  }
};
