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
  console.log(allStudentResponses);
  let allStudentScore;
  let maxScore;
  if (Array.isArray(allStudentResponses)) {
    allStudentScore = allStudentResponses.map((response) => {
      maxScore = response.BotChatQuestions.length;
      response.BotChatQuestions.filter((question) => question.isCorrect).length;
    });
  }

  const data = [
    {
      label: "Max Score",
      data: [
        {
          primary: "Test",
          score: 10,
        },
      ],
    },
    {
      label: "Highest Score",
      data: [
        {
          primary: "Test",
          score: 7,
        },
      ],
    },
    {
      label: "Your Score",
      data: [
        {
          primary: "Test",
          score: 5,
        },
      ],
    },
    {
      label: "Median Score",
      data: [
        {
          primary: "Test",
          score: 6,
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
          style: {
            tick: { color: "red" },
          },
        },
      ],
      []
    );

  return (
    <div className="h-[200px] flex">
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
      <span className="font-bold ">helllll</span>
    </div>
  );
};
