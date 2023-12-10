"use client";
import { TestResultsByBotId } from "@/app/dragon/teacher/queries";
import { AxisOptions, Chart } from "react-charts";
import { AllStudentResponsesByBotConfigId } from "../../../../queries";
import React from "react";
import { getTestMetadata } from "../../../../../../utils";

type ReportHistogramType = {
  testResults: TestResultsByBotId;
  allStudentResponses: AllStudentResponsesByBotConfigId;
};

export const ReportHistogram = ({
  testResults,
  allStudentResponses,
}: ReportHistogramType) => {
  const { maxScore, averageScore, highestScore, leastScore } =
    getTestMetadata(allStudentResponses);

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
      label: "Avg. Score",
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
