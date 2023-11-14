"use client";
import { TestResultsByBotId } from "@/app/dragon/teacher/queries";
import { AxisOptions, Chart } from "react-charts";
import { AllStudentResponsesByBotConfigId } from "../../../../queries";
import React from "react";

type ReportHistogramType = {
  testResults: TestResultsByBotId;
  allStudentResponses: AllStudentResponsesByBotConfigId;
};

export const ReportHistogram = ({
  testResults,
  allStudentResponses,
}: ReportHistogramType) => {
  let allStudentScore;
  let maxScore = 0;
  let leastScore = 0;
  let highestScore = 0;
  let averageScore = 0;

  if (Array.isArray(allStudentResponses)) {
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

  const myScore = testResults
    ? testResults.filter((question) => question?.isCorrect).length
    : 0;

  const data = [
    {
      label: "Max Score",
      data: [
        {
          primary: "Test",
          score: maxScore,
        },
      ],
    },
    {
      label: "Highest Score",
      data: [
        {
          primary: "Test",
          score: highestScore,
        },
      ],
    },
    {
      label: "Your Score",
      data: [
        {
          primary: "Test",
          score: myScore,
        },
      ],
    },
    {
      label: "Median Score",
      data: [
        {
          primary: "Test",
          score: averageScore,
        },
      ],
    },
    {
      label: "Least Score",
      data: [
        {
          primary: "Test",
          score: leastScore,
        },
      ],
    },
  ];

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum: { primary: string }) => datum.primary,
      elementType: "bar" as const,
    }),
    []
  );
  const secondaryAxes: AxisOptions<{ primary: string; score: number }>[] =
    React.useMemo(
      () => [
        {
          getValue: (datum: { score: number }) => datum.score,
          elementType: "bar" as const,
          min: 0,
          position: "left",
          show: true,
        },
      ],
      []
    );

  return (
    <div className="h-[300px]">
      <Chart
        options={{
          data,
          dark: true,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};
