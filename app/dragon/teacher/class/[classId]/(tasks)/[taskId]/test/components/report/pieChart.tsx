"use client";
import { TestResultsByBotId } from "@/lib/routers/tasks/test";
import { PieChart } from "react-minimal-pie-chart";

export default function PieChartComponent({
  testResults,
}: {
  testResults: TestResultsByBotId;
}) {
  if (!testResults) return null;
  const correctAnswers = testResults.filter(
    (question) => question?.isCorrect,
  ).length;
  const incorrectAnswers = testResults.length - correctAnswers;
  const totalQuestions = testResults.length;

  const chartData = [
    {
      title: `Correct answers ${(
        (correctAnswers / totalQuestions) *
        100
      ).toFixed(1)}%`,
      value: correctAnswers,
      color: "#21C55D",
    },
    {
      title: `Incorrect answers ${(
        (incorrectAnswers / totalQuestions) *
        100
      ).toFixed(1)}%`,
      value: incorrectAnswers,
      color: "#EF4444",
    },
  ];

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="h-40 w-40">
        <PieChart
          animate
          animationDuration={500}
          data={chartData}
          lengthAngle={360}
          lineWidth={20}
          paddingAngle={6}
          radius={30}
          startAngle={4}
        />
      </div>
      <div>
        {/*  Show toltal, correct and incorrect */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <div className=" flex w-full justify-between space-x-10">
              <div>Total</div>
              <div>{totalQuestions}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className=" flex w-full justify-between space-x-10">
              <div>Correct</div>
              <div>{correctAnswers}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className=" flex w-full justify-between space-x-10">
              <div>Incorrect</div>
              <div>{incorrectAnswers}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
