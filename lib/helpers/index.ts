import { AllStudentResponsesByBotConfigId } from "../../app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/queries";
import { TaskType } from "@/types/dragon";
import { Grade } from "@prisma/client";
import { taskPropertiesMap } from "@/lib/constants";

/**
 * Calculates the test metadata based on the given student responses.
 *
 * @param {AllStudentResponsesByBotConfigId} allStudentResponses - The student responses for all bot configurations.
 * @return {Object} - An object containing the maximum score, highest score, least score, and average score.
 */
export const getTestMetadata = (
  allStudentResponses: AllStudentResponsesByBotConfigId,
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
      acc > curr ? curr : acc,
    );
    highestScore = allStudentScore.reduce((acc, curr) =>
      acc < curr ? curr : acc,
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

  if (words.length === 1) {
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const name = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return name;
};

export const getTaskProperties = (taskType: TaskType) => {
  return taskPropertiesMap[taskType];
};

export const getFormattedDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-UK", {
    month: "short",
    day: "numeric",
  });

export function getFormattedGrade({
  grade,
  options,
}: {
  grade: Grade;
  options?: { numberOnly?: boolean };
}) {
  // Split the string by underscore
  const { numberOnly } = options || {};

  let parts = grade.split("_");
  if (numberOnly) {
    return parts[parts.length - 1];
  }
  // Capitalize the first letter of each part
  let converted =
    parts[0].charAt(0).toUpperCase() +
    parts[0].slice(1).toLowerCase() +
    " " +
    parts[1];

  return converted;
}

export const generateNameOfClass = ({
  grade,
  section = "",
}: {
  grade: Grade | undefined;
  section?: string | null;
}): string => {
  if (!grade) {
    return "";
  }
  const formattedGrade = getFormattedGrade({ grade });
  const formattedSection = section ? `-${section}` : "";
  return `${formattedGrade}${formattedSection}`;
};

export const formatUrl = (url: string) => {
  if (!url) return url;
  if (!url.match(/^(http|https):\/\//)) {
    url = `http://${url}`;
  }
  if (!url.match(/^http[s]?:\/\/www\./)) {
    url = url.replace(/^http[s]?:\/\//, "http://www.");
  }
  return url;
};
